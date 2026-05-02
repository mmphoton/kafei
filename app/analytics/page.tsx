import { prisma } from '@/lib/prisma';
import { RatingChart, TagChart, FeedbackChart, RatioScatter, type FeedbackDatum, type RatingDatum, type TagCountDatum } from '@/components/charts';

export default async function Analytics() {
  const brews = await prisma.brew.findMany({ orderBy: { tastedAt: 'asc' } });
  const feedback = await prisma.feedback.findMany();
  const brewTags = await prisma.brewTag.findMany({ include: { tag: true } });

  const ratingData: RatingDatum[] = brews.map((brew: { tastedAt: Date; rating: number; brewRatio: number }) => ({
    date: brew.tastedAt.toISOString().slice(5, 10),
    rating: brew.rating,
    ratio: brew.brewRatio,
  }));

  const tagCountMap = brewTags.reduce<Record<string, TagCountDatum>>((acc, brewTag: { tag: { name: string } }) => {
    const key = brewTag.tag.name;
    const current = acc[key] ?? { name: key, count: 0 };
    acc[key] = { ...current, count: current.count + 1 };
    return acc;
  }, {});

  const feedbackData: FeedbackDatum[] = ['better', 'same', 'worse'].map((name: string) => ({
    name,
    value: feedback.filter((entry: { value: string }) => entry.value === name).length,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-xl">Recommendation Analytics</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card"><RatingChart data={ratingData} /></div>
        <div className="card"><TagChart data={Object.values(tagCountMap)} /></div>
        <div className="card"><FeedbackChart data={feedbackData} /></div>
        <div className="card"><RatioScatter data={ratingData} /></div>
      </div>
    </div>
  );
}

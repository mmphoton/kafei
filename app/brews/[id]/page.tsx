export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Compass } from '@/components/compass';
import { FeedbackForm } from '@/components/feedback-form';

type RecommendationView = {
  id: string;
  variable: string;
  direction: string;
  stepSize: string;
};

type FeedbackView = {
  id: string;
  value: string;
  followedStatus: string;
  note: string | null;
  createdAt: Date;
};

type BrewView = {
  id: string;
  brewMethod: string;
  brewRatio: number;
  rating: number;
  notes: string | null;
  tastingNotes: string | null;
  previousBrewId: string | null;
  x: number;
  y: number;
  recommendations: RecommendationView[];
  feedbackGiven: FeedbackView[];
};

export default async function BrewDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brew = (await prisma.brew.findUnique({
    where: { id },
    include: { recommendations: true, feedbackGiven: { orderBy: { createdAt: 'desc' } } },
  })) as BrewView | null;

  if (!brew) return notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Brew detail</h1>
      <div className="card space-y-2">
        <p>Method {brew.brewMethod} · ratio {brew.brewRatio.toFixed(2)} · rating {brew.rating}</p>
        {brew.tastingNotes && <p>Tasting notes: {brew.tastingNotes}</p>}
        {brew.notes && <p>Notes: {brew.notes}</p>}
        <Compass x={brew.x} y={brew.y} />
      </div>
      <div className="card space-y-2">
        <h2 className="font-semibold">Suggested next adjustments</h2>
        {brew.recommendations.map((recommendation) => (
          <p key={recommendation.id}>
            {recommendation.variable}: {recommendation.direction} ({recommendation.stepSize})
          </p>
        ))}
      </div>

      {brew.previousBrewId && (
        <div className="card space-y-2">
          <h2 className="font-semibold">How did this brew compare?</h2>
          <FeedbackForm currentBrewId={brew.id} previousBrewId={brew.previousBrewId} />
        </div>
      )}

      {brew.feedbackGiven.length > 0 && (
        <div className="card space-y-2">
          <h2 className="font-semibold">Saved feedback</h2>
          {brew.feedbackGiven.map((fb) => (
            <p key={fb.id}>{fb.value} · followed {fb.followedStatus}{fb.note ? ` · ${fb.note}` : ''}</p>
          ))}
        </div>
      )}
    </div>
  );
}

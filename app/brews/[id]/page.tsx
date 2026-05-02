import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Compass } from '@/components/compass';

type RecommendationView = {
  id: string;
  variable: string;
  direction: string;
  stepSize: string;
};

type BrewView = {
  brewMethod: string;
  brewRatio: number;
  rating: number;
  x: number;
  y: number;
  recommendations: RecommendationView[];
};

export default async function BrewDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brew = (await prisma.brew.findUnique({
    where: { id },
    include: { recommendations: true, feedbackGiven: true },
  })) as BrewView | null;

  if (!brew) return notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl">Brew detail</h1>
      <div className="card">
        <p>Method {brew.brewMethod} · ratio {brew.brewRatio.toFixed(2)} · rating {brew.rating}</p>
        <Compass x={brew.x} y={brew.y} />
      </div>
      <div className="card">
        {brew.recommendations.map((recommendation) => (
          <p key={recommendation.id}>
            {recommendation.variable}: {recommendation.direction} ({recommendation.stepSize})
          </p>
        ))}
      </div>
    </div>
  );
}

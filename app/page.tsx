export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

type DashboardBrew = {
  id: string;
  brewMethod: string;
  rating: number;
};

export default async function Page() {
  const brews = (await prisma.brew.findMany({
    take: 5,
    orderBy: { tastedAt: 'desc' },
  })) as DashboardBrew[];

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Coffee Dashboard</h1>
      <div className="card">
        <p>Total brews: {brews.length}</p>
        {brews.map((brew) => (
          <p key={brew.id}>{brew.brewMethod} · rating {brew.rating}</p>
        ))}
      </div>
    </main>
  );
}

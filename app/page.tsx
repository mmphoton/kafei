export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { hasDatabaseUrl } from '@/lib/db-guard';

type DashboardBrew = {
  id: string;
  brewMethod: string;
  rating: number;
};

export default async function Page() {
  let brews: DashboardBrew[] = [];
  let dbError: string | null = null;

  if (hasDatabaseUrl()) {
    try {
      brews = (await prisma.brew.findMany({
        take: 5,
        orderBy: { tastedAt: 'desc' },
      })) as DashboardBrew[];
    } catch {
      dbError = 'Database is not reachable. Check DATABASE_URL and migrations.';
    }
  } else {
    dbError = 'DATABASE_URL is not configured.';
  }

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Coffee Dashboard</h1>
      <div className="card">
        {dbError ? <p>{dbError}</p> : <p>Total brews: {brews.length}</p>}
        {brews.map((brew) => (
          <p key={brew.id}>{brew.brewMethod} · rating {brew.rating}</p>
        ))}
      </div>
    </main>
  );
}

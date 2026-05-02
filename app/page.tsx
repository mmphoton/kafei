export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { hasDatabaseUrl } from '@/lib/db-guard';

type DashboardBrew = {
  id: string;
  brewMethod: string;
  rating: number;
  tastedAt: Date;
};

export default async function Page() {
  let brews: DashboardBrew[] = [];
  let dbError: string | null = null;

  if (hasDatabaseUrl()) {
    try {
      brews = (await prisma.brew.findMany({
        take: 10,
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
      <div className="card space-y-3">
        {dbError ? (
          <p>{dbError}</p>
        ) : (
          <>
            <p>Total recent brews: {brews.length}</p>
            {brews.length === 0 && <p>No brews yet. Start by logging one.</p>}
            {brews.map((brew) => (
              <p key={brew.id}>
                <Link className="underline" href={`/brews/${brew.id}`}>{brew.brewMethod}</Link> · rating {brew.rating} · {new Date(brew.tastedAt).toLocaleDateString()}
              </p>
            ))}
          </>
        )}
      </div>
    </main>
  );
}

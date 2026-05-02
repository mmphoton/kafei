export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { mem } from '@/lib/memory-store';

export default async function Page() {
  let brews: Array<{ id: string; brewMethod: string; rating: number; tastedAt: Date }> = [];
  let dbError: string | null = null;

  try {
    brews = await prisma.brew.findMany({ take: 10, orderBy: { tastedAt: 'desc' } });
  } catch {
    dbError = 'Running in local in-memory mode (database unavailable).';
    brews = mem.brews.slice(-10).reverse();
  }

  return <main className="space-y-4"><h1 className="text-2xl font-semibold">Coffee Dashboard</h1><div className="card space-y-3">{dbError && <p>{dbError}</p>}<p>Total recent brews: {brews.length}</p>{brews.length===0&&<p>No brews yet. Start by logging one.</p>}{brews.map((brew)=><p key={brew.id}><Link className='underline' href={`/brews/${brew.id}`}>{brew.brewMethod}</Link> · rating {brew.rating} · {new Date(brew.tastedAt).toLocaleDateString()}</p>)}</div></main>;
}

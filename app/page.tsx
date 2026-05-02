import { prisma } from '@/lib/prisma';
export default async function Page(){const brews=await prisma.brew.findMany({take:5,orderBy:{tastedAt:'desc'}});return <main className='space-y-4'><h1 className='text-2xl font-semibold'>Coffee Dashboard</h1><div className='card'><p>Total brews: {brews.length}</p>{brews.map(b=><p key={b.id}>{b.brewMethod} · rating {b.rating}</p>)}</div></main>}

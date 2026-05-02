import { prisma } from '@/lib/prisma';
export async function GET(){const rows=await prisma.brew.findMany(); const csv=['id,method,ratio,rating,date',...rows.map(r=>`${r.id},${r.brewMethod},${r.brewRatio},${r.rating},${r.tastedAt.toISOString()}`)].join('\n'); return new Response(csv,{headers:{'content-type':'text/csv'}})}

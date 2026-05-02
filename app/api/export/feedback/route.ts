import { prisma } from '@/lib/prisma';
export async function GET(){const rows=await prisma.feedback.findMany(); const csv=['id,value,followedStatus,createdAt',...rows.map(r=>`${r.id},${r.value},${r.followedStatus},${r.createdAt.toISOString()}`)].join('\n'); return new Response(csv,{headers:{'content-type':'text/csv'}})}

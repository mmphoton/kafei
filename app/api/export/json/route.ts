import { prisma } from '@/lib/prisma';
export async function GET(){const data=await prisma.brew.findMany({include:{recommendations:true}}); return Response.json(data)}

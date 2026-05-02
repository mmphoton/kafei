import { prisma } from '@/lib/prisma';
import { z } from 'zod';
const schema=z.object({currentBrewId:z.string(),previousBrewId:z.string(),recommendationId:z.string().optional(),value:z.enum(['better','same','worse']),followedStatus:z.enum(['exactly','partially','not_at_all']),note:z.string().optional()});
export async function POST(req:Request){const body=schema.parse(await req.json()); const fb=await prisma.feedback.create({data:body}); return Response.json(fb)}

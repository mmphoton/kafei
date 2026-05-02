import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { mem, uid } from '@/lib/memory-store';
const schema=z.object({currentBrewId:z.string(),previousBrewId:z.string(),recommendationId:z.string().optional(),value:z.enum(['better','same','worse']),followedStatus:z.enum(['exactly','partially','not_at_all']),note:z.string().optional()});
export async function POST(req:Request){const body=schema.parse(await req.json()); try{const fb=await prisma.feedback.create({data:body}); return Response.json(fb);}catch{const fb={id:uid(),...body,createdAt:new Date()}; mem.feedback.push(fb); return Response.json(fb);}}

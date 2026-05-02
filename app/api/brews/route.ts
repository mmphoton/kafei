import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAdvice, positionFromTags } from '@/lib/recommendation';
import { z } from 'zod';
const schema=z.object({coffeeId:z.string(),grinderId:z.string(),brewMethod:z.string(),grinderSetting:z.number(),doseG:z.number(),beverageOutputG:z.number(),waterInputG:z.number(),brewRatio:z.number(),waterTempC:z.number(),brewTimeSec:z.number(),tastingNotes:z.string().optional(),tags:z.array(z.string()),rating:z.number(),notes:z.string().optional(),followedPreviousAdvice:z.boolean(),previousBrewId:z.string().nullable().optional()});
export async function POST(req:Request){const input=schema.parse(await req.json()); const pos=positionFromTags(input.tags,input.brewRatio);
 const brew=await prisma.brew.create({data:{...input, previousBrewId:input.previousBrewId||null,x:pos.x,y:pos.y}});
 for (const tag of input.tags){const t=await prisma.tasteTag.upsert({where:{name:tag},create:{name:tag,groupName:'custom'},update:{}}); await prisma.brewTag.create({data:{brewId:brew.id,tagId:t.id}});}
 const advice=generateAdvice(input.tags,input.brewRatio); for(const a of advice){await prisma.recommendation.create({data:{brewId:brew.id,...a}})}
 return NextResponse.json({id:brew.id}); }

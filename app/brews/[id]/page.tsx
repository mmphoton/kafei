export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Compass } from '@/components/compass';
import { FeedbackForm } from '@/components/feedback-form';
import { mem } from '@/lib/memory-store';

export default async function BrewDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let brew:any=null; let fallback=false;
  try { brew = await prisma.brew.findUnique({ where: { id }, include: { recommendations: true, feedbackGiven: { orderBy: { createdAt: 'desc' } } } }); }
  catch { fallback=true; const b=mem.brews.find(x=>x.id===id); if(!b) return notFound(); brew={...b,recommendations:mem.recs.filter(r=>r.brewId===id),feedbackGiven:mem.feedback.filter(f=>f.currentBrewId===id)}; }
  if (!brew) return notFound();
  return <div className='space-y-4'><h1 className='text-2xl font-semibold'>Brew detail</h1>{fallback&&<p className='text-amber-300'>Using in-memory mode.</p>}<div className='card'><p>Method {brew.brewMethod} · ratio {brew.brewRatio.toFixed(2)} · rating {brew.rating}</p><Compass x={brew.x} y={brew.y} /></div><div className='card'>{brew.recommendations.map((r:any)=><p key={r.id}>{r.variable}: {r.direction} ({r.stepSize})</p>)}</div>{brew.previousBrewId&&<div className='card'><FeedbackForm currentBrewId={brew.id} previousBrewId={brew.previousBrewId} /></div>}</div>;
}

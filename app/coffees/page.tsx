export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { mem, uid } from '@/lib/memory-store';

async function createCoffee(formData: FormData) { 'use server'; const name=String(formData.get('name')||'').trim(); if(!name) return;
  try { await prisma.coffee.create({data:{name,type:String(formData.get('type')||'').trim()||null,origin:String(formData.get('origin')||'').trim()||null,roastLevel:String(formData.get('roastLevel')||'').trim()||null}}); }
  catch { mem.coffees.push({id:uid(),name,type:String(formData.get('type')||'').trim()||null,origin:String(formData.get('origin')||'').trim()||null,roastLevel:String(formData.get('roastLevel')||'').trim()||null,createdAt:new Date()}); }
  revalidatePath('/coffees'); revalidatePath('/brews/new'); }

export default async function CoffeesPage(){ let coffees:any[]=[]; let fallback=false; try{coffees=await prisma.coffee.findMany({orderBy:{createdAt:'desc'}});}catch{fallback=true; coffees=[...mem.coffees].reverse();}
return <div className='space-y-4'><h1 className='text-2xl font-semibold'>Coffees</h1>{fallback&&<p className='text-amber-300'>Using in-memory mode.</p>}<form action={createCoffee} className='card grid gap-3 md:grid-cols-2'><input name='name' placeholder='Name' required/><input name='type' placeholder='Type'/><input name='origin' placeholder='Origin'/><input name='roastLevel' placeholder='Roast level'/><button className='rounded bg-emerald-700 px-3 py-2 md:col-span-2 w-fit'>Add coffee</button></form><div className='card'>{coffees.map(c=><p key={c.id}>{c.name} · {c.origin||'—'}</p>)}</div></div> }

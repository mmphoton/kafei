import { prisma } from '@/lib/prisma';
import { tagGroups } from '@/lib/constants';
import { redirect } from 'next/navigation';

async function create(formData:FormData){'use server';
  const tags=formData.getAll('tags').map(String); const dose=Number(formData.get('doseG')); const output=Number(formData.get('beverageOutputG')); const ratio=output/dose;
  const res=await fetch(`${process.env.NEXT_PUBLIC_BASE_URL||'http://localhost:3000'}/api/brews`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
    coffeeId:String(formData.get('coffeeId')), grinderId:String(formData.get('grinderId')), brewMethod:String(formData.get('brewMethod')), grinderSetting:Number(formData.get('grinderSetting')), doseG:dose, beverageOutputG:output, waterInputG:Number(formData.get('waterInputG')), brewRatio:ratio, waterTempC:Number(formData.get('waterTempC')), brewTimeSec:Number(formData.get('brewTimeSec')), tastingNotes:String(formData.get('tastingNotes')||''), tags, rating:Number(formData.get('rating')), notes:String(formData.get('notes')||''), followedPreviousAdvice:formData.get('followedPreviousAdvice')==='on', previousBrewId:String(formData.get('previousBrewId')||'')||null
  })}); const data=await res.json(); redirect(`/brews/${data.id}`);
}
export default async function NewBrew(){const coffees=await prisma.coffee.findMany(); const grinders=await prisma.grinder.findMany();
return <form action={create} className='space-y-4'><h1 className='text-xl'>New Brew Log</h1><div className='grid md:grid-cols-3 gap-3'>
<select name='coffeeId' aria-label='Coffee'>{coffees.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
<select name='grinderId' aria-label='Grinder'>{grinders.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select>
<input name='brewMethod' placeholder='Brew method' required />
<input name='grinderSetting' type='number' step='0.1' placeholder='Grinder setting' required/>
<input name='doseG' type='number' step='0.1' placeholder='Dose g' required/>
<input name='beverageOutputG' type='number' step='0.1' placeholder='Output g' required/>
<input name='waterInputG' type='number' step='0.1' placeholder='Water g' required/>
<input name='waterTempC' type='number' step='0.1' placeholder='Temp °C' required/>
<input name='brewTimeSec' type='number' placeholder='Time sec' required/>
<input name='rating' type='number' min='1' max='10' placeholder='Rating 1-10' required/>
<textarea name='tastingNotes' placeholder='Tasting notes'/><textarea name='notes' placeholder='Freeform notes'/>
</div>
<div className='card'><p>Taste chips</p>{Object.entries(tagGroups).map(([k,v])=><div key={k}><p>{k}</p><div className='flex flex-wrap gap-2'>{v.map(t=><label key={t}><input type='checkbox' name='tags' value={t}/> {t}</label>)}</div></div>)}</div>
<button className='px-3 py-2 bg-emerald-700 rounded'>Save Brew</button></form>}

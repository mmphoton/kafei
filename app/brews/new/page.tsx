export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { tagGroups } from '@/lib/constants';
import { generateAdvice, positionFromTags } from '@/lib/recommendation';
import { redirect } from 'next/navigation';

type CoffeeOption = { id: string; name: string };
type GrinderOption = { id: string; name: string };

async function create(formData: FormData) {
  'use server';
  const tags = formData.getAll('tags').map(String);
  const dose = Number(formData.get('doseG'));
  const output = Number(formData.get('beverageOutputG'));
  const ratio = output / dose;
  const pos = positionFromTags(tags, ratio);

  const brew = await prisma.brew.create({
    data: {
      coffeeId: String(formData.get('coffeeId')),
      grinderId: String(formData.get('grinderId')),
      brewMethod: String(formData.get('brewMethod')),
      grinderSetting: Number(formData.get('grinderSetting')),
      doseG: dose,
      beverageOutputG: output,
      waterInputG: Number(formData.get('waterInputG')),
      brewRatio: ratio,
      waterTempC: Number(formData.get('waterTempC')),
      brewTimeSec: Number(formData.get('brewTimeSec')),
      tastingNotes: String(formData.get('tastingNotes') || ''),
      rating: Number(formData.get('rating')),
      notes: String(formData.get('notes') || ''),
      followedPreviousAdvice: formData.get('followedPreviousAdvice') === 'on',
      previousBrewId: String(formData.get('previousBrewId') || '') || null,
      x: pos.x,
      y: pos.y,
    },
  });

  for (const tag of tags) {
    const tagRecord = await prisma.tasteTag.upsert({
      where: { name: tag },
      create: { name: tag, groupName: 'custom' },
      update: {},
    });
    await prisma.brewTag.create({ data: { brewId: brew.id, tagId: tagRecord.id } });
  }

  const advice = generateAdvice(tags, ratio);
  for (const rule of advice) {
    await prisma.recommendation.create({ data: { brewId: brew.id, ...rule } });
  }

  redirect(`/brews/${brew.id}`);
}

export default async function NewBrew() {
  const coffees = (await prisma.coffee.findMany()) as CoffeeOption[];
  const grinders = (await prisma.grinder.findMany()) as GrinderOption[];

  if (coffees.length === 0 || grinders.length === 0) {
    return <div className='card'><p>Add at least one coffee and grinder before logging a brew.</p></div>;
  }

  return (
    <form action={create} className="space-y-4">
      <h1 className="text-xl">New Brew Log</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <select name="coffeeId" aria-label="Coffee">{coffees.map((coffee) => <option key={coffee.id} value={coffee.id}>{coffee.name}</option>)}</select>
        <select name="grinderId" aria-label="Grinder">{grinders.map((grinder) => <option key={grinder.id} value={grinder.id}>{grinder.name}</option>)}</select>
        <input name="brewMethod" placeholder="Brew method" required />
        <input name="grinderSetting" type="number" step="0.1" placeholder="Grinder setting" required />
        <input name="doseG" type="number" step="0.1" placeholder="Dose g" required />
        <input name="beverageOutputG" type="number" step="0.1" placeholder="Output g" required />
        <input name="waterInputG" type="number" step="0.1" placeholder="Water g" required />
        <input name="waterTempC" type="number" step="0.1" placeholder="Temp °C" required />
        <input name="brewTimeSec" type="number" placeholder="Time sec" required />
        <input name="rating" type="number" min="1" max="10" placeholder="Rating 1-10" required />
        <textarea name="tastingNotes" placeholder="Tasting notes" />
        <textarea name="notes" placeholder="Freeform notes" />
      </div>
      <div className="card"><p>Taste chips</p>{Object.entries(tagGroups).map(([groupKey, tags]) => <div key={groupKey}><p>{groupKey}</p><div className="flex flex-wrap gap-2">{tags.map((tag) => <label key={tag}><input type="checkbox" name="tags" value={tag} /> {tag}</label>)}</div></div>)}</div>
      <button className="rounded bg-emerald-700 px-3 py-2">Save Brew</button>
    </form>
  );
}

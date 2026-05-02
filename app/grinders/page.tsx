export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type GrinderView = {
  id: string;
  name: string;
  minSetting: number;
  maxSetting: number;
  unit: string;
  finerDirection: string;
  helperText: string;
};

async function createGrinder(formData: FormData) {
  'use server';

  const name = String(formData.get('name') || '').trim();
  if (!name) return;

  await prisma.grinder.create({
    data: {
      name,
      minSetting: Number(formData.get('minSetting')),
      maxSetting: Number(formData.get('maxSetting')),
      unit: String(formData.get('unit') || 'steps').trim(),
      finerDirection: String(formData.get('finerDirection') || 'lower').trim(),
      helperText: String(formData.get('helperText') || '').trim(),
      isCustom: true,
    },
  });

  revalidatePath('/grinders');
  revalidatePath('/brews/new');
}

export default async function GrindersPage() {
  const grinders = (await prisma.grinder.findMany({ orderBy: { name: 'asc' } })) as GrinderView[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Grinders</h1>
      <form action={createGrinder} className="card grid gap-3 md:grid-cols-2">
        <input name="name" placeholder="Grinder name" required />
        <input name="unit" placeholder="Unit (clicks/steps)" defaultValue="clicks" />
        <input name="minSetting" type="number" step="0.1" placeholder="Min setting" required />
        <input name="maxSetting" type="number" step="0.1" placeholder="Max setting" required />
        <input name="finerDirection" placeholder="Finer direction (lower/higher)" defaultValue="lower" />
        <input name="helperText" placeholder="Optional helper text" />
        <button className="rounded bg-emerald-700 px-3 py-2 md:col-span-2 w-fit">Add grinder</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-zinc-300"><th>Name</th><th>Range</th><th>Direction</th><th>Notes</th></tr></thead>
          <tbody>
            {grinders.map((grinder) => (
              <tr key={grinder.id} className="border-t border-zinc-700">
                <td className="py-2 pr-3">{grinder.name}</td>
                <td className="py-2 pr-3">{grinder.minSetting}–{grinder.maxSetting} {grinder.unit}</td>
                <td className="py-2 pr-3">{grinder.finerDirection}</td>
                <td className="py-2">{grinder.helperText || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

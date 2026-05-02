export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type CoffeeView = {
  id: string;
  name: string;
  type: string | null;
  origin: string | null;
  roastLevel: string | null;
};

async function createCoffee(formData: FormData) {
  'use server';

  const name = String(formData.get('name') || '').trim();
  if (!name) return;

  await prisma.coffee.create({
    data: {
      name,
      type: String(formData.get('type') || '').trim() || null,
      origin: String(formData.get('origin') || '').trim() || null,
      roastLevel: String(formData.get('roastLevel') || '').trim() || null,
    },
  });

  revalidatePath('/coffees');
  revalidatePath('/brews/new');
}

export default async function CoffeesPage() {
  const coffees = (await prisma.coffee.findMany({ orderBy: { createdAt: 'desc' } })) as CoffeeView[];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Coffees</h1>
      <form action={createCoffee} className="card grid gap-3 md:grid-cols-2">
        <input name="name" placeholder="Name (e.g., Ethiopia Guji)" required />
        <input name="type" placeholder="Type (single origin, blend...)" />
        <input name="origin" placeholder="Origin" />
        <input name="roastLevel" placeholder="Roast level" />
        <button className="rounded bg-emerald-700 px-3 py-2 md:col-span-2 w-fit">Add coffee</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-300">
              <th>Name</th><th>Type</th><th>Origin</th><th>Roast</th>
            </tr>
          </thead>
          <tbody>
            {coffees.map((coffee) => (
              <tr key={coffee.id} className="border-t border-zinc-700">
                <td className="py-2 pr-3">{coffee.name}</td>
                <td className="py-2 pr-3">{coffee.type || '—'}</td>
                <td className="py-2 pr-3">{coffee.origin || '—'}</td>
                <td className="py-2">{coffee.roastLevel || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

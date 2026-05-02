import { prisma } from '@/lib/prisma';

type BrewExportRow = {
  id: string;
  brewMethod: string;
  brewRatio: number;
  rating: number;
  tastedAt: Date;
};

export async function GET() {
  const rows = (await prisma.brew.findMany()) as BrewExportRow[];
  const csv = [
    'id,method,ratio,rating,date',
    ...rows.map((row) => `${row.id},${row.brewMethod},${row.brewRatio},${row.rating},${row.tastedAt.toISOString()}`),
  ].join('\n');

  return new Response(csv, { headers: { 'content-type': 'text/csv' } });
}

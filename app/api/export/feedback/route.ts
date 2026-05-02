import { prisma } from '@/lib/prisma';

type FeedbackExportRow = {
  id: string;
  value: string;
  followedStatus: string;
  createdAt: Date;
};

export async function GET() {
  const rows = (await prisma.feedback.findMany()) as FeedbackExportRow[];
  const csv = [
    'id,value,followedStatus,createdAt',
    ...rows.map((row) => `${row.id},${row.value},${row.followedStatus},${row.createdAt.toISOString()}`),
  ].join('\n');

  return new Response(csv, { headers: { 'content-type': 'text/csv' } });
}

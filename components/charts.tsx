'use client';

import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';

export type RatingDatum = { date: string; rating: number; ratio: number };
export type TagCountDatum = { name: string; count: number };
export type FeedbackDatum = { name: string; value: number };

export function RatingChart({ data }: { data: RatingDatum[] }) {
  return (
    <LineChart width={360} height={220} data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line dataKey="rating" stroke="#10b981" />
    </LineChart>
  );
}

export function TagChart({ data }: { data: TagCountDatum[] }) {
  return (
    <BarChart width={360} height={220} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#60a5fa" />
    </BarChart>
  );
}

export function FeedbackChart({ data }: { data: FeedbackDatum[] }) {
  const colors = ['#10b981', '#f59e0b', '#ef4444'];
  return (
    <PieChart width={300} height={220}>
      <Pie data={data} dataKey="value" nameKey="name">
        {data.map((_, i) => (
          <Cell key={i} fill={colors[i % 3]} />
        ))}
      </Pie>
    </PieChart>
  );
}

export function RatioScatter({ data }: { data: RatingDatum[] }) {
  return (
    <ScatterChart width={360} height={220}>
      <XAxis dataKey="ratio" />
      <YAxis dataKey="rating" />
      <Tooltip />
      <Scatter data={data} fill="#a78bfa" />
    </ScatterChart>
  );
}

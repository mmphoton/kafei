'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FeedbackForm({ currentBrewId, previousBrewId }: { currentBrewId: string; previousBrewId: string }) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setStatus('saving');
    try {
      const payload = {
        currentBrewId,
        previousBrewId,
        value: formData.get('value'),
        followedStatus: formData.get('followedStatus'),
        note: String(formData.get('note') || '') || undefined,
      };
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save feedback');
      setStatus('saved');
      router.refresh();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <div className="grid gap-2 md:grid-cols-2">
        <select name="value" required defaultValue="">
          <option value="" disabled>Result quality</option>
          <option value="better">Better</option>
          <option value="same">Same</option>
          <option value="worse">Worse</option>
        </select>
        <select name="followedStatus" required defaultValue="">
          <option value="" disabled>How closely followed advice</option>
          <option value="exactly">Exactly</option>
          <option value="partially">Partially</option>
          <option value="not_at_all">Not at all</option>
        </select>
      </div>
      <textarea name="note" placeholder="Optional notes about the result" />
      <button disabled={status === 'saving'} className="rounded bg-amber-700 px-3 py-2">Save feedback</button>
      {status === 'saved' && <p className="text-emerald-400 text-sm">Feedback saved.</p>}
      {status === 'error' && <p className="text-rose-400 text-sm">Could not save feedback.</p>}
    </form>
  );
}

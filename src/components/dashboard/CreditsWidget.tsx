'use client';

import { useEffect, useState } from 'react';

export default function CreditsWidget() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/credits', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.credits === 'number') setCredits(d.credits);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <span className="text-slate-500 text-sm">…</span>;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-card px-3 py-2">
      <span className="text-slate-400 text-sm">Credits</span>
      <span className="font-mono font-semibold text-primary-400">{credits ?? '—'}</span>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

type JobSummary = { id: string; status: string; createdAt: string }[];

export default function JobStatusIndicator() {
  const [pending, setPending] = useState(0);

  useEffect(() => {
    function poll() {
      fetch('/api/jobs?limit=50&status=PENDING', { credentials: 'include' })
        .then((r) => r.json())
        .then((d: { jobs?: JobSummary }) => {
          const count = d.jobs?.filter((j) => j.status === 'PENDING').length ?? 0;
          setPending(count);
        })
        .catch(() => {});
    }
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  if (pending === 0) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-400">
      <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
      {pending} job{pending !== 1 ? 's' : ''} in queue
    </div>
  );
}

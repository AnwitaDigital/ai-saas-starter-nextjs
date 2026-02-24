'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Job = {
  id: string;
  type: string;
  status: string;
  creditsUsed: number | null;
  createdAt: string;
  completedAt: string | null;
};

export default function JobsPage() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get('highlight');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs?limit=50', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? []))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s: string) =>
    s === 'COMPLETED' ? 'text-emerald-400' : s === 'FAILED' ? 'text-red-400' : s === 'PROCESSING' ? 'text-amber-400' : 'text-slate-400';

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Jobs</h1>
      <p className="text-slate-400 mb-6">AI generation jobs. Click for details.</p>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : jobs.length === 0 ? (
        <p className="text-slate-500">No jobs yet.</p>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/jobs/${job.id}`}
              className={`block rounded-lg border border-surface-border bg-surface-card p-4 hover:border-primary-500/50 transition-colors ${
                highlight === job.id ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-slate-300">{job.id.slice(0, 12)}…</span>
                <span className={`text-sm ${statusColor(job.status)}`}>{job.status}</span>
              </div>
              <div className="mt-1 flex gap-4 text-xs text-slate-500">
                <span>{new Date(job.createdAt).toLocaleString()}</span>
                {job.creditsUsed != null && <span>{job.creditsUsed} credits</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

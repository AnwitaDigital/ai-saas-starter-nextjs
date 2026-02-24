'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type JobDetail = {
  id: string;
  type: string;
  status: string;
  input: unknown;
  output: unknown;
  error: string | null;
  creditsUsed: number | null;
  createdAt: string;
  completedAt: string | null;
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/jobs/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => (d.id ? setJob(d) : setJob(null)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (!job) return <p className="text-slate-500">Job not found.</p>;

  const statusColor =
    job.status === 'COMPLETED' ? 'text-emerald-400' :
    job.status === 'FAILED' ? 'text-red-400' :
    job.status === 'PROCESSING' ? 'text-amber-400' : 'text-slate-400';

  return (
    <div>
      <Link href="/dashboard/jobs" className="text-sm text-primary-400 hover:underline mb-4 inline-block">
        ← Jobs
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Job {job.id.slice(0, 12)}…</h1>
      <p className={`mb-6 ${statusColor}`}>{job.status}</p>
      <div className="space-y-4 max-w-2xl">
        <div className="rounded-lg border border-surface-border bg-surface-card p-4">
          <h2 className="text-sm font-medium text-slate-400 mb-2">Input</h2>
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
            {JSON.stringify(job.input, null, 2)}
          </pre>
        </div>
        {job.output && (
          <div className="rounded-lg border border-surface-border bg-surface-card p-4">
            <h2 className="text-sm font-medium text-slate-400 mb-2">Output</h2>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
              {typeof job.output === 'object' && job.output !== null && 'text' in job.output
                ? (job.output as { text: string }).text
                : JSON.stringify(job.output, null, 2)}
            </pre>
          </div>
        )}
        {job.error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
            {job.error}
          </div>
        )}
        <div className="text-sm text-slate-500">
          Created {new Date(job.createdAt).toLocaleString()}
          {job.completedAt && ` · Completed ${new Date(job.completedAt).toLocaleString()}`}
          {job.creditsUsed != null && ` · ${job.creditsUsed} credits`}
        </div>
      </div>
    </div>
  );
}

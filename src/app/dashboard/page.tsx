import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-6">Welcome. Use credits to run AI generations.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/generate"
          className="rounded-xl border border-surface-border bg-surface-card p-6 hover:border-primary-500/50 transition-colors"
        >
          <h2 className="font-medium text-primary-400 mb-1">Generate</h2>
          <p className="text-sm text-slate-400">Create content with AI. Uses credits per request.</p>
        </Link>
        <Link
          href="/dashboard/usage"
          className="rounded-xl border border-surface-border bg-surface-card p-6 hover:border-primary-500/50 transition-colors"
        >
          <h2 className="font-medium text-primary-400 mb-1">Usage</h2>
          <p className="text-sm text-slate-400">View credit usage history.</p>
        </Link>
        <Link
          href="/dashboard/jobs"
          className="rounded-xl border border-surface-border bg-surface-card p-6 hover:border-primary-500/50 transition-colors"
        >
          <h2 className="font-medium text-primary-400 mb-1">Jobs</h2>
          <p className="text-sm text-slate-400">Track AI job status and results.</p>
        </Link>
      </div>
    </div>
  );
}

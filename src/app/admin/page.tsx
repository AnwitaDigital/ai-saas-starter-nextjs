'use client';

import { useEffect, useState } from 'react';

type Stats = {
  users: number;
  jobs: number;
  totalCreditsUsed: number;
  jobsByStatus: Record<string, number>;
};

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  credits: number;
  createdAt: string;
};

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/admin/users', { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([statsRes, usersRes]) => {
        if (statsRes.error) setError(statsRes.error);
        else setStats(statsRes);
        if (usersRes.error) setError(usersRes.error);
        else setUsers(usersRes.users ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin panel</h1>
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-surface-border bg-surface-card p-4">
            <p className="text-slate-400 text-sm">Users</p>
            <p className="text-2xl font-mono text-primary-400">{stats.users}</p>
          </div>
          <div className="rounded-xl border border-surface-border bg-surface-card p-4">
            <p className="text-slate-400 text-sm">Jobs</p>
            <p className="text-2xl font-mono text-primary-400">{stats.jobs}</p>
          </div>
          <div className="rounded-xl border border-surface-border bg-surface-card p-4">
            <p className="text-slate-400 text-sm">Total credits used</p>
            <p className="text-2xl font-mono text-primary-400">{stats.totalCreditsUsed}</p>
          </div>
          <div className="rounded-xl border border-surface-border bg-surface-card p-4">
            <p className="text-slate-400 text-sm">By status</p>
            <p className="text-sm font-mono text-slate-300 mt-1">
              {Object.entries(stats.jobsByStatus ?? {}).map(([k, v]) => `${k}: ${v}`).join(' · ')}
            </p>
          </div>
        </div>
      )}
      <h2 className="text-lg font-medium mb-4">Users</h2>
      <div className="overflow-x-auto rounded-lg border border-surface-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-card text-left text-slate-400">
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Credits</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-surface-border/50">
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-slate-400">{u.name ?? '—'}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 font-mono">{u.credits}</td>
                <td className="p-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

type Log = { id: string; action: string; creditsUsed: number; createdAt: string };

export default function UsagePage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/usage?limit=50', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        setLogs(d.logs ?? []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Usage history</h1>
      <p className="text-slate-400 mb-6">Credit usage over time. Total entries: {total}</p>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : logs.length === 0 ? (
        <p className="text-slate-500">No usage yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-surface-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-card text-left text-slate-400">
                <th className="p-3">Action</th>
                <th className="p-3">Credits</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-surface-border/50">
                  <td className="p-3">{log.action}</td>
                  <td className="p-3 font-mono">{log.creditsUsed}</td>
                  <td className="p-3 text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setJobId(null);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Request failed');
        return;
      }
      setJobId(data.jobId);
      setPrompt('');
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">AI Generate</h1>
      <p className="text-slate-400 mb-6">Submit a prompt. Credits are deducted when the job runs.</p>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            rows={4}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-white placeholder-slate-500 focus:border-primary-500 focus:outline-none"
            placeholder="What should the AI generate?"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {jobId && (
          <p className="text-sm text-primary-400">
            Job queued: <a href={`/dashboard/jobs?highlight=${jobId}`} className="underline">{jobId}</a>
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

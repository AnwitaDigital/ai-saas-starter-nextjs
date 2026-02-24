'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-surface-border bg-surface-card p-6 shadow-xl">
        <h1 className="text-xl font-semibold mb-4">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-white placeholder-slate-500 focus:border-primary-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-white placeholder-slate-500 focus:border-primary-500 focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password (min 8)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-white placeholder-slate-500 focus:border-primary-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-500 disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account? <Link href="/login" className="text-primary-400 hover:underline">Log in</Link>
        </p>
      </div>
    </main>
  );
}

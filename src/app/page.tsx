import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-primary-400 mb-2">AI SaaS Starter</h1>
      <p className="text-slate-400 mb-8 max-w-md text-center">
        Next.js + Node + Credits system. Launch your AI product faster.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-surface-card border border-surface-border px-4 py-2 text-sm hover:bg-slate-700"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
        >
          Sign up
        </Link>
      </div>
    </main>
  );
}

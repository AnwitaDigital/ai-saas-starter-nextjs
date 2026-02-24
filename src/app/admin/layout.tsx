import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-surface-border bg-surface-card px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="font-semibold text-primary-400">Admin</Link>
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-300">← Dashboard</Link>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}

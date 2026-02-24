'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/generate', label: 'Generate' },
  { href: '/dashboard/usage', label: 'Usage' },
  { href: '/dashboard/jobs', label: 'Jobs' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-surface-border bg-surface-card p-4">
      <Link href="/dashboard" className="mb-6 block font-semibold text-primary-400">
        AI SaaS
      </Link>
      <nav className="space-y-1">
        {nav.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`block rounded-lg px-3 py-2 text-sm ${
              pathname === href ? 'bg-primary-600/20 text-primary-400' : 'text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            {label}
          </Link>
        ))}
        <Link
          href="/admin"
          className="mt-4 block rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
        >
          Admin →
        </Link>
      </nav>
    </aside>
  );
}

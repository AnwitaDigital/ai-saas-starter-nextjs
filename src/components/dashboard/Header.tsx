'use client';

import Link from 'next/link';
import CreditsWidget from './CreditsWidget';
import JobStatusIndicator from './JobStatusIndicator';

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-surface-border bg-surface-card px-6 py-4">
      <div className="flex items-center gap-4">
        <JobStatusIndicator />
      </div>
      <div className="flex items-center gap-4">
        <CreditsWidget />
        <form action="/api/auth/logout" method="post" className="inline">
          <Link
            href="/api/auth/logout"
            className="text-sm text-slate-400 hover:text-slate-300"
            onClick={(e) => {
              e.preventDefault();
              document.cookie = 'token=; path=/; max-age=0';
              window.location.href = '/login';
            }}
          >
            Log out
          </Link>
        </form>
      </div>
    </header>
  );
}

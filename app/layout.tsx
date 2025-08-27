import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Retail Hub — Storefront',
  description: 'ACME Corp retail storefront',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text">
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-border bg-surface">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="text-lg font-semibold text-primary">
                Retail Hub
              </Link>
              <nav className="flex items-center gap-4 text-sm text-muted">
                <Link href="/catalog">Catalog</Link>
                <Link href="/orders">Orders</Link>
                <Link href="/reports">Reports</Link>
                <Link href="/login" className="text-text">Login</Link>
                <Link href="/cart" aria-label="Cart">🛒</Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border bg-surface">
            <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted">
              <div className="flex items-center justify-between">
                <span>© {new Date().getFullYear()} ACME Corp</span>
                <span>Env: {process.env.NODE_ENV}</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

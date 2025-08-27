"use client";

import { useState } from 'react';
import { z } from 'zod';

const loginSchema = z.object({
  usernameOrEmail: z.string().min(3, 'Enter your username or email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const payload = {
      usernameOrEmail: String(formData.get('usernameOrEmail') || ''),
      password: String(formData.get('password') || ''),
    };
    const parse = loginSchema.safeParse(payload);
    if (!parse.success) {
      setError(parse.error.errors[0]?.message || 'Invalid input');
      setLoading(false);
      return;
    }
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const problem = await res.json().catch(() => ({}));
      setError(problem.detail || 'Login failed');
      setLoading(false);
      return;
    }
    window.location.href = '/';
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form action={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm text-muted" htmlFor="usernameOrEmail">Username or Email</label>
          <input id="usernameOrEmail" name="usernameOrEmail" className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-text" />
        </div>
        <div>
          <label className="block text-sm text-muted" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-text" />
        </div>
        {error && <div className="text-sm text-danger">{error}</div>}
        <button disabled={loading} className="w-full rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary700 disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">No account? <a href="/register" className="text-primary">Register</a></p>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { z } from 'zod';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((vals) => vals.password === vals.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const payload = {
      username: String(formData.get('username') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
      confirmPassword: String(formData.get('confirmPassword') || ''),
    };
    const parse = registerSchema.safeParse(payload);
    if (!parse.success) {
      setError(parse.error.errors[0]?.message || 'Invalid input');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: payload.username,
        email: payload.email,
        password: payload.password,
      }),
    });
    if (res.status === 201 || res.ok) {
      window.location.href = '/';
      return;
    }
    const problem = await res.json().catch(() => ({}));
    setError(problem.detail || 'Registration failed');
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      <form action={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm text-muted" htmlFor="username">Username</label>
          <input id="username" name="username" className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-text" />
        </div>
        <div>
          <label className="block text-sm text-muted" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-text" />
        </div>
        <div>
          <label className="block text-sm text-muted" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-text" />
        </div>
        <div>
          <label className="block text-sm text-muted" htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-text" />
        </div>
        {error && <div className="text-sm text-danger">{error}</div>}
        <button disabled={loading} className="w-full rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary700 disabled:opacity-50">
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">Already have an account? <a href="/login" className="text-primary">Sign in</a></p>
    </div>
  );
}

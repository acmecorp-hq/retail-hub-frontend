import { NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { serviceBase } from '@/lib/api-client';

export async function POST() {
  // Best-effort notify Accounts
  try {
    await fetch(`${serviceBase.accounts}/auth/logout`, { method: 'POST' });
  } catch {}

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: appConfig.sessionCookieName,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}

import { NextRequest, NextResponse } from 'next/server';
import { serviceBase } from '@/lib/api-client';
import { appConfig } from '@/lib/config';
import { generateRequestId } from '@/lib/request-id';

export async function GET(req: NextRequest) {
  const requestId = generateRequestId();
  const token = req.cookies.get(appConfig.sessionCookieName)?.value;
  if (!token) {
    return NextResponse.json({ title: 'Unauthorized', status: 401, detail: 'Missing or invalid credentials.' }, { status: 401 });
  }
  const res = await fetch(`${serviceBase.accounts}/users/me`, {
    headers: {
      'X-Request-Id': requestId,
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  const data = await res.json().catch(() => undefined);
  return NextResponse.json(data ?? { title: res.statusText, status: res.status }, { status: res.status });
}

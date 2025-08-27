import { NextRequest, NextResponse } from 'next/server';
import { serviceBase } from '@/lib/api-client';
import { appConfig } from '@/lib/config';
import { generateRequestId } from '@/lib/request-id';

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const body = await req.json();
  const res = await fetch(`${serviceBase.accounts}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Id': requestId,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => undefined);

  if (!res.ok) {
    return NextResponse.json(data ?? { title: res.statusText, status: res.status }, { status: res.status });
  }

  const response = NextResponse.json({
    user: data.user,
  });

  if (data?.token) {
    response.cookies.set({
      name: appConfig.sessionCookieName,
      value: data.token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: appConfig.sessionMaxAge,
    });
  }

  return response;
}

import { NextRequest, NextResponse } from 'next/server';
import { serviceBase } from '@/lib/api-client';
import { appConfig } from '@/lib/config';
import { generateRequestId } from '@/lib/request-id';

export async function POST(req: NextRequest) {
  const requestId = generateRequestId();
  const idempotencyKey = generateRequestId();
  const body = await req.json();
  const res = await fetch(`${serviceBase.accounts}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Id': requestId,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => undefined);

  if (res.status === 201) {
    // Auto-login for better UX
    try {
      const loginIdentifier = body.username || body.email;
      if (loginIdentifier && body.password) {
        const loginRes = await fetch(`${serviceBase.accounts}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Id': requestId,
          },
          body: JSON.stringify({ usernameOrEmail: loginIdentifier, password: body.password }),
        });
        const loginData = await loginRes.json().catch(() => undefined);
        const response = NextResponse.json({ user: data });
        if (loginRes.ok && loginData?.token) {
          response.cookies.set({
            name: appConfig.sessionCookieName,
            value: loginData.token,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: appConfig.sessionMaxAge,
          });
        }
        return response;
      }
      return NextResponse.json({ user: data }, { status: 201 });
    } catch {
      return NextResponse.json({ user: data }, { status: 201 });
    }
  }

  return NextResponse.json(data ?? { title: res.statusText, status: res.status }, { status: res.status });
}

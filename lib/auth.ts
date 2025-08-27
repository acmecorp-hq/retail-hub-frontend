import { cookies } from 'next/headers';
import { appConfig } from './config';

export function getSessionTokenFromCookies(): string | undefined {
  const cookieStore = cookies();
  const token = cookieStore.get(appConfig.sessionCookieName)?.value;
  return token;
}

export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set({
    name: appConfig.sessionCookieName,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: appConfig.sessionMaxAge,
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set({
    name: appConfig.sessionCookieName,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

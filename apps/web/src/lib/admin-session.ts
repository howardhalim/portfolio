import { cookies } from 'next/headers';
import { ADMIN_COOKIE } from './admin-cookie';

export function getAdminToken(): string | undefined {
  return cookies().get(ADMIN_COOKIE)?.value;
}

export function setAdminToken(token: string, maxAgeSeconds: number): void {
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: maxAgeSeconds,
  });
}

export function clearAdminToken(): void {
  cookies().delete({ name: ADMIN_COOKIE, path: '/admin' });
}
import { cookies } from 'next/headers';
import { ADMIN_COOKIE } from './admin-cookie';

export async function getAdminToken(): Promise<string | undefined> {
  return (await cookies()).get(ADMIN_COOKIE)?.value;
}

export async function setAdminToken(token: string, maxAgeSeconds: number): Promise<void> {
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: maxAgeSeconds,
  });
}

export async function clearAdminToken(): Promise<void> {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: '/admin' });
}

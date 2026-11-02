'use server';

import { redirect } from 'next/navigation';
import { adminLogin } from '@/lib/admin-api';
import { clearAdminToken, setAdminToken } from '@/lib/admin-session';
import { adminLoginSchema, type AdminLoginInput } from '@/lib/schemas';

export async function loginAction(
  input: AdminLoginInput,
): Promise<{ ok: false; message: string } | undefined> {
  const parsed = adminLoginSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: 'Enter your username and password.' };
  }

  const result = await adminLogin(parsed.data);

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  setAdminToken(result.token, result.expiresInSeconds);
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  clearAdminToken();
  redirect('/admin/login');
}
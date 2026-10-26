import { API_BASE_URL } from './api';
import {
  adminIdentitySchema,
  loginResponseSchema,
  type AdminLoginInput,
} from './schemas';

export type AdminLoginResult =
  | { ok: true; token: string; expiresInSeconds: number }
  | { ok: false; message: string };

const GENERIC_ERROR = 'Something went wrong. Please try again later.';

export async function adminLogin(input: AdminLoginInput): Promise<AdminLoginResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      cache: 'no-store',
    });

    if (response.status === 401) {
      return { ok: false, message: 'Invalid username or password.' };
    }

    if (!response.ok) {
      console.error(`POST /api/admin/login failed with status ${response.status}`);
      return { ok: false, message: GENERIC_ERROR };
    }

    const body = loginResponseSchema.parse(await response.json());
    return { ok: true, token: body.token, expiresInSeconds: body.expiresInSeconds };
  } catch (error) {
    console.error('Failed to reach the API for admin login', error);
    return { ok: false, message: GENERIC_ERROR };
  }
}

export async function getAdminIdentity(token: string): Promise<{ username: string } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return adminIdentitySchema.parse(await response.json());
  } catch (error) {
    console.error('Failed to verify the admin token with the API', error);
    return null;
  }
}
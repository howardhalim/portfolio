import { redirect } from 'next/navigation';
import { API_BASE_URL } from './api';
import { getAdminToken } from './admin-session';
import {
  adminBlogPostListSchema,
  adminBlogPostSchema,
  adminIdentitySchema,
  apiValidationErrorSchema,
  loginResponseSchema,
  type AdminBlogPost,
  type AdminLoginInput,
  type BlogPostFormInput,
} from './schemas';

const GENERIC_ERROR = 'Something went wrong. Please try again later.';

export type AdminLoginResult =
  | { ok: true; token: string; expiresInSeconds: number }
  | { ok: false; message: string };

export type SaveFailure = {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string>;
};

export type SaveResult = { ok: true; id: number } | SaveFailure;

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

async function adminRequest(path: string, init: RequestInit = {}): Promise<Response | null> {
  const token = getAdminToken();

  if (!token) {
    redirect('/admin/login?expired=1');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
  } catch (error) {
    console.error(`Admin request to ${path} failed`, error);
    return null;
  }

  if (response.status === 401) {
    redirect('/admin/login?expired=1');
  }

  return response;
}

export async function listAdminBlogPosts(): Promise<AdminBlogPost[] | null> {
  const response = await adminRequest('/api/admin/blog-posts');

  if (!response || !response.ok) {
    return null;
  }

  const parsed = adminBlogPostListSchema.safeParse(await response.json());
  return parsed.success ? parsed.data : null;
}

export async function getAdminBlogPost(id: number): Promise<AdminBlogPost | null> {
  const response = await adminRequest(`/api/admin/blog-posts/${id}`);

  if (!response || !response.ok) {
    return null;
  }

  const parsed = adminBlogPostSchema.safeParse(await response.json());
  return parsed.success ? parsed.data : null;
}

export async function saveAdminBlogPost(
  id: number | null,
  input: BlogPostFormInput,
): Promise<SaveResult> {
  const response = await adminRequest(
    id === null ? '/api/admin/blog-posts' : `/api/admin/blog-posts/${id}`,
    { method: id === null ? 'POST' : 'PUT', body: JSON.stringify(input) },
  );

  if (!response) {
    return { ok: false, message: GENERIC_ERROR };
  }

  if (response.ok) {
    const parsed = adminBlogPostSchema.safeParse(await response.json());
    return parsed.success ? { ok: true, id: parsed.data.id } : { ok: false, message: GENERIC_ERROR };
  }

  if (response.status === 400) {
    const body = apiValidationErrorSchema.safeParse(await response.json());
    return {
      ok: false,
      message: 'Please fix the highlighted fields.',
      fieldErrors: body.success ? body.data.errors : undefined,
    };
  }

  if (response.status === 409) {
    return {
      ok: false,
      message: 'That slug is already used by another post.',
      fieldErrors: { slug: 'Already used by another post' },
    };
  }

  if (response.status === 404) {
    return { ok: false, message: 'That post no longer exists.' };
  }

  console.error(`Saving a blog post failed with status ${response.status}`);
  return { ok: false, message: GENERIC_ERROR };
}

export async function deleteAdminBlogPost(
  id: number,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const response = await adminRequest(`/api/admin/blog-posts/${id}`, { method: 'DELETE' });

  if (!response) {
    return { ok: false, message: GENERIC_ERROR };
  }

  if (response.status === 204 || response.status === 404) {
    return { ok: true };
  }

  console.error(`Deleting blog post ${id} failed with status ${response.status}`);
  return { ok: false, message: GENERIC_ERROR };
}
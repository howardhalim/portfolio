import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/admin/actions';
import { getAdminIdentity } from '@/lib/admin-api';
import { getAdminToken } from '@/lib/admin-session';

export const metadata: Metadata = { title: 'Admin' };

export default async function AdminHomePage() {
  const token = getAdminToken();
  const identity = token ? await getAdminIdentity(token) : null;

  if (!identity) {
    redirect('/admin/login?expired=1');
  }

  return (
    <main className="px-6 pb-24 pt-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Admin</h1>
        <p className="mt-2 text-zinc-400">
          Signed in as <span className="text-zinc-200">{identity.username}</span>.
        </p>
        <p className="mt-6 text-sm text-zinc-500">
          Content management comes next: blog posts, projects, skills and your About text.
        </p>
        <form action={logoutAction} className="mt-8">
          <button
            type="submit"
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
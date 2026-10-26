import type { Metadata } from 'next';
import { LoginForm } from '@/components/LoginForm';

export const metadata: Metadata = { title: 'Admin login' };

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { expired?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 pt-16">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Admin</h1>
        <p className="mt-2 text-sm text-zinc-400">Sign in to manage the site.</p>
        <LoginForm expired={searchParams.expired === '1'} />
      </div>
    </main>
  );
}
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">404</p>
      <h1 className="mt-4 text-3xl font-bold text-zinc-50">Page not found</h1>
      <p className="mt-2 text-zinc-400">That page doesn&apos;t exist or has moved.</p>
      <Link href="/" className="mt-8 text-sm font-medium text-indigo-400 hover:text-indigo-300">
        ← Back home
      </Link>
    </main>
  );
}
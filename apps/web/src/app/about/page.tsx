import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactCta } from '@/components/ContactCta';
import { Skills } from '@/components/Skills';
import { getProfile } from '@/lib/api';

export const metadata: Metadata = { title: 'About' };

export default async function AboutPage() {
  const profile = await getProfile();

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <p className="text-zinc-400">
          Profile unavailable. Check that the API is running and reload.
        </p>
      </main>
    );
  }

  return (
    <main>
      <section className="px-6 pb-16 pt-32">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
            ← Back home
          </Link>
          <p className="mt-6 text-sm font-medium uppercase tracking-widest text-indigo-400">
            {profile.title}
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-50">
            About {profile.name}
          </h1>
          <p className="mt-6 text-lg text-zinc-400">{profile.bio}</p>
          <div className="mt-8 whitespace-pre-line leading-7 text-zinc-300">{profile.about}</div>

          {profile.links.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3">
              {profile.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500"
                  >
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <Skills />
      <ContactCta />
    </main>
  );
}
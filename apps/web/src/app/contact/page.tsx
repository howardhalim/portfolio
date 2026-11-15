import type { Metadata } from 'next';
import Link from 'next/link';
import { getProfile } from '@/lib/api';
import { CONTACT_EMAIL } from '@/lib/site-config';

export const metadata: Metadata = { title: 'Contact' };

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <main className="px-6 pb-24 pt-32">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Back home
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-50">Contact</h1>
        <p className="mt-2 text-zinc-400">
          Have a project in mind or just want to say hi? The best way to reach me is by email.
        </p>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-8 inline-block rounded-md bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
        >
          {CONTACT_EMAIL}
        </a>

        {profile && profile.links.length > 0 && (
          <div className="mt-12 border-t border-zinc-900 pt-8">
            <p className="text-sm text-zinc-500">You can also find me here:</p>
            <ul className="mt-4 flex flex-wrap gap-3">
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
          </div>
        )}
      </div>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <main className="px-6 pb-24 pt-32">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Back home
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-50">Contact</h1>
        <p className="mt-2 text-zinc-400">
          Have a project in mind or just want to say hi? Send me a message.
        </p>
        <ContactForm />
      </div>
    </main>
  );
}
import Link from 'next/link';

export function ContactCta() {
  return (
    <section id="contact" className="scroll-mt-16 border-t border-zinc-900 px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-50">
          Let&apos;s build something together
        </h2>
        <p className="mt-4 text-zinc-400">
          Have a project in mind or just want to say hi? I&apos;d love to hear from you.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-md bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
        >
          Contact me
        </Link>
      </div>
    </section>
  );
}

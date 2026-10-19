import Link from 'next/link';

export function About({ bio }: { bio: string }) {
  return (
    <section id="about" className="scroll-mt-16 border-t border-zinc-900 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-50">About Me</h2>
        <p className="mt-6 text-zinc-400">{bio}</p>
        <Link
          href="/about"
          className="mt-6 inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          Read more →
        </Link>
      </div>
    </section>
  );
}
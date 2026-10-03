type HeroProps = {
  name: string;
  title: string;
  tagline: string;
};

export function Hero({ name, title, tagline }: HeroProps) {
  return (
    <section
      id="home"
      className="flex min-h-screen scroll-mt-16 flex-col items-start justify-center px-6"
    >
      <div className="mx-auto w-full max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">{title}</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-50 sm:text-6xl">{name}</h1>
        <p className="mt-6 max-w-2xl text-lg text-zinc-400">{tagline}</p>
        <div className="mt-10 flex gap-4">
          <a
            href="#projects"
            className="rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
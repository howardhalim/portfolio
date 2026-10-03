import Link from 'next/link';
import { getProjects } from '@/lib/api';
import { ProjectCard } from './ProjectCard';

export async function FeaturedProjects() {
  const projects = await getProjects();
  const featured = projects.slice(0, 3);

  return (
    <section id="projects" className="scroll-mt-16 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-50">Featured Projects</h2>
            <p className="mt-2 text-zinc-400">A few things I&apos;ve built recently.</p>
          </div>
          <Link
            href="/projects"
            className="hidden text-sm font-medium text-indigo-400 hover:text-indigo-300 sm:block"
          >
            View all →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-zinc-500">
            Projects will show up here once the API is reachable.
          </p>
        )}
      </div>
    </section>
  );
}
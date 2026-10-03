import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { getProjects } from '@/lib/api';

export const metadata: Metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="px-6 pb-24 pt-32">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← Back home
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-50">Projects</h1>
        <p className="mt-2 text-zinc-400">Everything I&apos;ve built.</p>

        {projects.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-sm text-zinc-500">No projects yet.</p>
        )}
      </div>
    </main>
  );
}
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/api';

type ProjectPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params.slug);
  return { title: project ? project.title : 'Project not found' };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="px-6 pb-24 pt-32">
      <article className="mx-auto max-w-3xl">
        <Link href="/projects" className="text-sm text-zinc-400 hover:text-zinc-100">
          ← All projects
        </Link>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-50">{project.title}</h1>
        <p className="mt-4 text-lg text-zinc-400">{project.summary}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <li key={tech} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
              {tech}
            </li>
          ))}
        </ul>

        <p className="mt-10 whitespace-pre-line text-zinc-300">{project.description}</p>

        <div className="mt-10 flex gap-4">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
            >
              View code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500"
            >
              Live site
            </a>
          )}
        </div>
      </article>
    </main>
  );
}
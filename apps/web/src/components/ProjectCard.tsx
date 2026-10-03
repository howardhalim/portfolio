import type { Project } from '@/lib/schemas';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700">
      <h3 className="text-lg font-semibold text-zinc-50">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm text-zinc-400">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <li
            key={tech}
            className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300"
          >
            {tech}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex gap-4 text-sm">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Code →
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Live →
          </a>
        )}
      </div>
    </article>
  );
}

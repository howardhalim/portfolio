const skills = [
  'TypeScript',
  'Next.js',
  'React',
  'Tailwind CSS',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'Docker',
  'GitHub Actions',
  'Turborepo',
];

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-16 border-t border-zinc-900 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-50">Skills & Tools</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-300"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

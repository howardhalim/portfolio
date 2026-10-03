INSERT INTO projects (slug, title, summary, description, repo_url, live_url, image_url)
VALUES (
    'portfolio-monorepo',
    'Portfolio Monorepo',
    'A full-stack personal portfolio built to practice production-grade architecture and workflows.',
    'A Turborepo-managed monorepo pairing a Next.js (App Router) frontend with a layered Spring Boot REST API, PostgreSQL via Flyway-managed migrations, and a GitHub Actions CI pipeline.',
    'https://github.com/howardhalim/portfolio',
    NULL,
    NULL
);

INSERT INTO project_tech_stack (project_id, tech)
SELECT id, tech
FROM projects, UNNEST(ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Spring Boot', 'PostgreSQL']) AS tech
WHERE slug = 'portfolio-monorepo';

# Portfolio

A personal portfolio site, built as a learning project to practice
professional-team architecture, tooling, and workflows — not just to ship
a website.

## Stack

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend**: Spring Boot (Java 21) — REST API
- **Monorepo tooling**: Turborepo + npm workspaces
- **Database**: PostgreSQL (Docker for local dev)
- **CI/CD**: GitHub Actions

## Project structure

```
portfolio/
├── apps/
│   ├── web/            # Next.js + TypeScript frontend
│   └── api/             # Spring Boot backend
├── packages/
│   └── config/         # Shared prettier/tsconfig config
├── .github/
│   └── workflows/      # CI pipelines
├── turbo.json
└── README.md
```

`apps/api` is a plain Maven project and is *not* orchestrated by Turborepo —
Turborepo only coordinates the npm-workspace packages (`apps/web`,
`packages/config`). The Java side gets its own CI job and is built/run with
Maven directly. This keeps the two ecosystems independent instead of forcing
a JS task runner to shell out to Maven.

## Prerequisites

Install these before running anything locally:

- [Node.js](https://nodejs.org/) 20+ and npm 10+
- [JDK 21](https://adoptium.net/) (Temurin recommended)
- [Maven](https://maven.apache.org/) 3.9+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Postgres, added in a later step)

## Local development

### Database

```bash
docker compose up -d      # starts Postgres, from the repo root
```

Stop it with `docker compose down` (add `-v` to also wipe the data volume
and start clean next time).

### Frontend

```bash
npm install        # run once from the repo root
npm run dev --workspace=web
```

Runs at http://localhost:3000.

### Backend

Requires Postgres running (see above) — Flyway migrates the schema and
Spring connects to it on startup.

```bash
cd apps/api
mvn spring-boot:run
```

Runs at http://localhost:8080. Try:

- http://localhost:8080/api/projects
- http://localhost:8080/api/projects/portfolio-monorepo
- http://localhost:8080/actuator/health

## Current status

This repo is being built incrementally. As of now:

- [x] Monorepo scaffold (Turborepo + npm workspaces)
- [x] `apps/web` — Next.js hello-world page
- [x] `apps/api` — layered `Project` resource (entity, repository, DTO,
      service, controller) backed by Postgres via Flyway migrations,
      verified end-to-end against a Docker-run database
- [x] Centralized exception handling (`GlobalExceptionHandler`, RFC 7807
      `ProblemDetail` responses)
- [x] Base CI: lint-only, parallel jobs for web/api
- [ ] `BlogPost` and `Contact` resources, frontend fetching from the API,
      testing, pre-commit hooks — coming in later steps

## Known shortcuts (flagged for later)

- **No `mvnw` wrapper yet.** CI relies on Maven pre-installed on the GitHub
  Actions runner image, and local dev relies on your own Maven install. A
  real production setup would commit the Maven Wrapper so builds don't
  depend on whatever Maven version happens to be on the machine.
- **`lint-api` doesn't actually lint.** No Checkstyle/Spotless is configured
  yet, so the CI job just compiles the project as a stand-in gate. This will
  be replaced with real static analysis in the code-quality step.
- **`docker-compose.yml` only runs Postgres**, not the API itself — the
  original spec calls for both. Adding the API as a service needs a
  Dockerfile for `apps/api`, which hasn't been written yet.

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

### Frontend

```bash
npm install        # run once from the repo root
npm run dev --workspace=web
```

Runs at http://localhost:3000.

### Backend

```bash
cd apps/api
mvn spring-boot:run
```

Runs at http://localhost:8080. Try:

- http://localhost:8080/api/hello
- http://localhost:8080/actuator/health

## Current status

This repo is being built incrementally. As of now:

- [x] Monorepo scaffold (Turborepo + npm workspaces)
- [x] `apps/web` — Next.js hello-world page
- [x] `apps/api` — Spring Boot hello-world endpoint + actuator health
- [x] Base CI: lint-only, parallel jobs for web/api
- [ ] Full page set, real API endpoints, Postgres + Flyway, testing, Docker
      Compose, pre-commit hooks — coming in later steps

## Known shortcuts (flagged for later)

- **No `mvnw` wrapper yet.** CI relies on Maven pre-installed on the GitHub
  Actions runner image, and local dev relies on your own Maven install. A
  real production setup would commit the Maven Wrapper so builds don't
  depend on whatever Maven version happens to be on the machine.
- **`lint-api` doesn't actually lint.** No Checkstyle/Spotless is configured
  yet, so the CI job just compiles the project as a stand-in gate. This will
  be replaced with real static analysis in the code-quality step.
- **No lockfile committed yet.** `package-lock.json` doesn't exist because
  npm isn't installed on this machine yet. Run `npm install` once you have
  Node set up, then commit the generated lockfile — `npm ci` in CI depends
  on it.

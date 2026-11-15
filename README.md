# Portfolio

My personal portfolio site, built as a learning project: the goal is to
practise the architecture, testing and tooling a professional team would use,
not only to ship a website.

## Stack

- **Frontend**: Next.js 14 (App Router, Server Components) + TypeScript + Tailwind CSS
- **Backend**: Spring Boot 3.3 (Java 21), layered REST API
- **Database**: PostgreSQL 16, schema and content managed with Flyway migrations
- **Monorepo tooling**: Turborepo + npm workspaces
- **Containers**: multi-stage Dockerfiles for the API and web app
- **CI**: GitHub Actions
- **Hosting (planned)**: Google Cloud Run + Cloud SQL

## How it works

```
Browser ──> Next.js (apps/web) ──> Spring Boot API (apps/api) ──> PostgreSQL
```

- The site is fully data-driven: profile, About text, projects, skills and
  links all come from the API. Nothing is hard-coded in the pages.
- **Content is published through Flyway migrations.** To change the text on
  the site, add a new migration (`V13`, `V14`, ...). Migrations that have
  already been applied are never edited, because Flyway checks their checksums.
- The API serves one active profile, chosen with `PROFILE_SLUG`.
- Contact is by email only (no form).

## Project structure

```
portfolio/
├── apps/
│   ├── web/                  # Next.js + TypeScript frontend
│   └── api/                  # Spring Boot backend (plain Maven project)
├── packages/
│   └── config/               # Shared prettier/tsconfig config
├── .github/workflows/        # CI pipeline
├── docker-compose.yml        # Postgres only, for local development
├── docker-compose.full.yml   # Production-like stack: Postgres + API + web
├── turbo.json
└── LICENSE
```

`apps/api` is a plain Maven project and is *not* orchestrated by Turborepo.
Turborepo only coordinates the npm-workspace packages (`apps/web`,
`packages/config`). The Java side has its own CI job and is built and run with
Maven directly, which keeps the two ecosystems independent.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ and npm 10+
- [JDK 21](https://adoptium.net/) (Temurin recommended)
- [Maven](https://maven.apache.org/) 3.9+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Local development

### 1. Database

```bash
docker compose up -d      # starts Postgres from the repo root
```

Stop it with `docker compose down` (add `-v` to also delete the data and start clean).

### 2. Backend

Flyway creates the schema and loads the content when the API starts.

```bash
cd apps/api
mvn spring-boot:run
```

Runs at http://localhost:8080. Try:

- http://localhost:8080/api/profile
- http://localhost:8080/api/projects
- http://localhost:8080/api/projects/portfolio-platform
- http://localhost:8080/actuator/health

### 3. Frontend

```bash
npm install                        # once, from the repo root
npm run dev --workspace=web
```

Runs at http://localhost:3000.

## Configuration

### API (`apps/api`)

| Variable | Default | Purpose |
|---|---|---|
| `DB_HOST` | `localhost` | Database host |
| `DB_PORT` | `5432` | Database port |
| `DB_NAME` | `portfolio` | Database name |
| `DB_USER` | `portfolio` | Database user |
| `DB_PASSWORD` | `portfolio` | Database password (**always override in production**) |
| `PROFILE_SLUG` | `default` | Which profile the API serves |
| `ADMIN_ENABLED` | `false` | Turns the admin area on |
| `PORT` | `8080` | HTTP port (Cloud Run sets this) |

### Web (`apps/web`)

| Variable | Default | Purpose |
|---|---|---|
| `API_BASE_URL` | `http://localhost:8080` | Where the web server finds the API |
| `ADMIN_ENABLED` | off | Turns the admin pages on (must match the API) |

## Admin area (optional, local only)

The admin area (blog post management) is **off by default** and returns 404/401
when disabled. It is meant for local use and is switched off in production.

To try it locally, create `apps/api/src/main/resources/application-local.yml`
(this file is git-ignored; never commit it):

```yaml
app:
  admin:
    enabled: true
    username: <your username>
    password-hash: <bcrypt hash of your password>
    jwt-secret: <random string, at least 32 characters>
```

Then start the API with `mvn spring-boot:run -Dspring-boot.run.profiles=local`,
and create `apps/web/.env.local` containing `ADMIN_ENABLED=true`.
The admin login is at http://localhost:3000/admin/login.

## Production-like stack in Docker

Runs Postgres, the API and the web app from their production Docker images,
with admin off. It uses its own ports and its own database volume, so it does
not interfere with local development.

```bash
docker compose -f docker-compose.full.yml -p portfolio-full up --build -d
```

- Web: http://localhost:3001
- API: http://localhost:8081

Stop it with `docker compose -f docker-compose.full.yml -p portfolio-full down`
(add `-v` only if you want to delete the database).

## Tests and checks

```bash
cd apps/api && mvn test              # unit, web-layer and security tests
npm run lint --workspace=web         # ESLint
npx tsc --noEmit                     # type check (run inside apps/web)
```

The API tests cover the service layer (Mockito), controllers (`@WebMvcTest`)
and the security rules: which endpoints are public, and that everything else is
denied by default.

## Security notes

- The API denies every request by default and allows only an explicit list of
  read-only public endpoints.
- Admin endpoints are not even registered unless `ADMIN_ENABLED=true`.
- Secrets live in git-ignored local files or environment variables, never in the repo.
- Docker images run as a non-root user and exclude secret files.

## Known shortcuts (flagged for later)

- **No `mvnw` wrapper yet.** CI uses the Maven installed on the GitHub runner;
  a production setup would commit the Maven Wrapper.
- **`lint-api` only compiles.** No Checkstyle/Spotless is configured yet.
- **CI does not run the tests or build the images yet.** It only lints and compiles.
- **No frontend tests yet** (unit or end-to-end).
- **No deployment pipeline yet.** Deploying to Google Cloud is planned.
- **Admin login has no rate limiting**, which is acceptable only because admin
  is off in production.
- **The contact-message backend code is dormant.** The site uses email only;
  the old code is kept for possible future use.
- **Next.js is on 14.2.x** and should be upgraded before going live.

## License

[MIT](LICENSE) © 2026 howardhalim

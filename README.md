# Portfolio

My personal portfolio site, built as a learning project: the goal is to
practise the architecture, testing and tooling a professional team would use,
not only to ship a website.

**Live site:** https://portfolio-web-23240902945.asia-southeast1.run.app

## Stack

- **Frontend**: Next.js 16 (App Router, Server Components) + React 19 + TypeScript + Tailwind CSS
- **Backend**: Spring Boot 3.3 (Java 21), layered REST API
- **Database**: PostgreSQL 16, schema and content managed with Flyway migrations
- **Monorepo tooling**: Turborepo + npm workspaces
- **Containers**: multi-stage Dockerfiles for the API and web app
- **CI/CD**: GitHub Actions
- **Hosting**: Google Cloud Run (web + API) and Cloud SQL (PostgreSQL)

## How it works

```
Browser ──> Next.js (apps/web) ──> Spring Boot API (apps/api) ──> PostgreSQL
```

- The site is fully data-driven: profile, About text, projects, skills and
  links all come from the API. Nothing is hard-coded in the pages.
- **Content is published through Flyway migrations.** To change the text on
  the site, add a new migration (`V14`, `V15`, ...). Migrations that have
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
├── deploy/                   # Cloud Build configs for building images by hand
├── .github/workflows/        # CI/CD pipeline
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

- [Node.js](https://nodejs.org/) 20.9+ and npm 10+
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
| `SPRING_DATASOURCE_URL` | built from the `DB_*` values | Full JDBC URL; used on Cloud Run to connect to Cloud SQL |
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
cd apps/web && npx tsc --noEmit      # type check
```

The API tests need no database. They cover the service layer (Mockito),
controllers (`@WebMvcTest`) and the security rules: which endpoints are
public, and that everything else is denied by default.

## Deploying to Google Cloud

### Architecture

```
Browser ──> Cloud Run: portfolio-web ──> Cloud Run: portfolio-api ──> Cloud SQL (PostgreSQL 16)
                                              │
                                              └── Secret Manager: db-password
```

- **Cloud Run** runs the two containers. It scales to zero when idle, so it costs
  almost nothing; the first request after a quiet period is slower (cold start).
- **Cloud SQL** (`db-f1-micro`, zonal, daily backups) is the main cost. It is billed
  by the hour while running, not per request.
- The API connects to Cloud SQL through the Cloud SQL Java connector (no IP allow-list),
  using its own service account with only the `Cloud SQL Client` role.
- The database password lives in **Secret Manager** and is injected as `DB_PASSWORD`.
- Each service runs under its own service account with the minimum permissions.
- On first start the API runs the Flyway migrations, which also load the site content.

### One-time setup (already done for this project)

In short: create a project and a budget alert, enable the Cloud Run, Cloud SQL,
Artifact Registry, Secret Manager and Cloud Build APIs, then:

1. Create an Artifact Registry Docker repository named `portfolio`.
2. Create a Cloud SQL PostgreSQL instance, a `portfolio` database and a `portfolio_app` user.
   Store the generated password in Secret Manager as `db-password`.
3. Create the `portfolio-api` service account (roles: Cloud SQL Client, and access to the secret)
   and the `portfolio-web` service account (no roles).
4. Build and push the images, then deploy `portfolio-api` and `portfolio-web`.
   The API gets `SPRING_DATASOURCE_URL`, `DB_USER`, `PROFILE_SLUG` and the `DB_PASSWORD` secret;
   the web app gets `API_BASE_URL` pointing at the API's URL.

The Cloud Build configs in `deploy/` build the images by hand:

```bash
gcloud builds submit apps/api --config=deploy/cloudbuild-api.yaml --substitutions=_TAG=v1
gcloud builds submit . --config=deploy/cloudbuild-web.yaml --substitutions=_TAG=v1
```

### Automatic deploys (GitHub Actions)

`.github/workflows/ci.yml` does the following:

- **Every pull request and push to `main`:** lint, type-check and build the web app, and run the API tests.
- **Every push to `main` that passes:** builds both images, tags them with the commit SHA, pushes
  them to Artifact Registry, deploys the API, waits for its health check, then deploys the web app.

GitHub authenticates to Google Cloud with **Workload Identity Federation**: the job asks GitHub for a
short-lived token, and Google accepts it only for this repository's `main` branch. There are **no
service account keys** stored anywhere.

One-time setup for the pipeline (bash syntax; the values are this project's, so change them for another project):

```bash
# 1. Trust GitHub, but only this repository's main branch
gcloud iam workload-identity-pools create github --location=global --display-name="GitHub"
gcloud iam workload-identity-pools providers create-oidc github-provider --location=global \
  --workload-identity-pool=github --display-name="GitHub provider" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --attribute-condition="assertion.repository=='howardhalim/portfolio' && assertion.ref=='refs/heads/main'"

# 2. A deployer identity with minimal permissions
gcloud iam service-accounts create github-deployer --display-name="GitHub Actions deployer"
SA=serviceAccount:github-deployer@howard-portfolio-888888.iam.gserviceaccount.com
gcloud artifacts repositories add-iam-policy-binding portfolio --location=asia-southeast1 --member=$SA --role=roles/artifactregistry.writer
gcloud projects add-iam-policy-binding howard-portfolio-888888 --member=$SA --role=roles/run.developer
gcloud projects add-iam-policy-binding howard-portfolio-888888 --member=$SA --role=roles/serviceusage.serviceUsageConsumer
gcloud iam service-accounts add-iam-policy-binding portfolio-api@howard-portfolio-888888.iam.gserviceaccount.com --member=$SA --role=roles/iam.serviceAccountUser
gcloud iam service-accounts add-iam-policy-binding portfolio-web@howard-portfolio-888888.iam.gserviceaccount.com --member=$SA --role=roles/iam.serviceAccountUser

# 3. Let GitHub (this repository) act as the deployer
gcloud iam service-accounts add-iam-policy-binding github-deployer@howard-portfolio-888888.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/23240902945/locations/global/workloadIdentityPools/github/attribute.repository/howardhalim/portfolio"
```

Then, in GitHub, go to **Settings → Secrets and variables → Actions → Variables** and add a repository
variable `DEPLOY_ENABLED` with the value `true`. Until it is set, the deploy job is skipped and the
checks still run.

### Changing the site content

Add a new Flyway migration (for example `V14__update_about.sql`) and push to `main`. The new API
revision starts, applies the migration to Cloud SQL, and the site shows the change.

## Security notes

- The API denies every request by default and allows only an explicit list of
  read-only public endpoints.
- Admin endpoints are not even registered unless `ADMIN_ENABLED=true`.
- Secrets live in git-ignored local files, environment variables or Secret Manager, never in the repo.
- Docker images run as a non-root user and exclude secret files.
- The pipeline uses short-lived credentials (Workload Identity Federation), not stored keys.

## Known shortcuts (flagged for later)

- **The API is publicly reachable** on its own Cloud Run URL. Everything except the read-only
  endpoints is denied, and admin is off, but a stricter setup would let only the web app call it.
- **Cloud SQL is a single zone** with no standby, to keep the cost down. Backups are on.
- **No `mvnw` wrapper yet.** CI uses the Maven installed on the GitHub runner;
  a production setup would commit the Maven Wrapper.
- **`mvn verify` runs the tests, but there is no Checkstyle/Spotless** static analysis yet.
- **GitHub Actions are pinned by version tag**, not by commit SHA.
- **No frontend tests yet** (unit or end-to-end).
- **No staging environment.** A merge to `main` deploys straight to production.
- **Admin login has no rate limiting**, which is acceptable only because admin
  is off in production.
- **The contact-message backend code is dormant.** The site uses email only;
  the old code is kept for possible future use.

## License

[MIT](LICENSE) © 2026 howardhalim

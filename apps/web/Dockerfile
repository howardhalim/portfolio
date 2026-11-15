# syntax=docker/dockerfile:1
# Build context is the repository root (npm workspaces + shared config live there).

# Stage 1: install dependencies and build the standalone Next.js server.
FROM node:20-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY packages/config/package.json packages/config/
RUN --mount=type=cache,target=/root/.npm npm ci
COPY packages ./packages
COPY apps/web ./apps/web
RUN npm run build --workspace=web

# Stage 2: a minimal runtime image with only the standalone output.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=8080 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/apps/web/.next/standalone ./
COPY --from=build --chown=app:app /app/apps/web/.next/static ./apps/web/.next/static
USER app
EXPOSE 8080
CMD ["node", "apps/web/server.js"]

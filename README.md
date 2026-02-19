# Fullstack React-NodeJs

Production-style fullstack monorepo.

## What this project demonstrates

- Monorepo architecture with shared typed contracts
- React frontend with server-state management and protected flows
- Node.js API with layered architecture and validation
- PostgreSQL modeling with Prisma
- JWT authentication + RBAC authorization
- CI quality gates (lint, typecheck, test, build)

## Tech stack

- Frontend: React 18, TypeScript, Vite, TailwindCSS, React Query, React Router
- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, Zod
- Shared package: `@fullstack/types`
- Tooling: ESLint, Vitest, npm workspaces, GitHub Actions

## Architecture

```text
apps/web (React)
  -> Axios client with Bearer token
  -> REST API calls

apps/api (Express)
  -> Routes -> Controllers -> Services
  -> Zod validation
  -> Auth middleware (JWT)
  -> RBAC middleware (ADMIN/MEMBER)
  -> Prisma ORM

PostgreSQL
  -> User, Project, Task models

shared/types
  -> Shared TS interfaces for API contracts
```

See `/docs/interview/architecture.md` for a talk-track version.

## Core feature 

Project Task Workflow:

- Create projects
- Select project in dashboard
- Create tasks with priority
- Move task status (`TODO -> IN_PROGRESS -> DONE`)
- Admin-only user listing panel to demonstrate RBAC

## Repository layout

- `/apps/web` frontend
- `/apps/api` backend
- `/shared/types` shared types
- `/.github/workflows/ci.yml` CI workflow
- `/docker-compose.yml` API + PostgreSQL stack

## Run locally

1. Install dependencies

```bash
npm install
```

2. Create env files

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

3. Start PostgreSQL (local service)

```bash
brew install postgresql@16
brew services start postgresql@16
/opt/homebrew/opt/postgresql@16/bin/createuser -s postgres || true
/opt/homebrew/opt/postgresql@16/bin/psql -d postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';" || true
/opt/homebrew/opt/postgresql@16/bin/createdb -O postgres fullstack || true
```

4. Prepare DB

```bash
npm run db:generate
cd apps/api && npx prisma db push && cd ../..
npm run db:seed
```

5. Run backend and frontend

```bash
npm run dev:api
npm run dev:web
```

- Frontend: <http://localhost:5173>
- Backend health: <http://localhost:4000/health>

## Optional Docker run

If Docker is installed:

```bash
npm run docker:up
npm run docker:down
```

## API overview

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`

Projects:

- `GET /api/projects`
- `POST /api/projects`

Tasks:

- `GET /api/projects/:projectId/tasks`
- `POST /api/projects/:projectId/tasks`
- `PATCH /api/projects/:projectId/tasks/:taskId/status`

Admin:

- `GET /api/admin/users` (ADMIN only)

Header:

- `Authorization: Bearer <token>`

## Seed users

- Admin: `admin@example.com` / `Password123!`
- Member: `member@example.com` / `Password123!`

## CI

GitHub Actions workflow (`/.github/workflows/ci.yml`) runs on push/PR:

- install
- prisma generate
- lint
- typecheck
- test
- build

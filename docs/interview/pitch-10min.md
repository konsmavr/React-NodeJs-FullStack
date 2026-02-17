# 10-Minute Project Walkthrough Script

## 0:00-1:00 - Problem and goal

I wanted a portfolio project that proves I can build and maintain a fullstack system, not just isolated pages or endpoints.

The goal was to show:

- frontend and backend integration
- authentication + authorization
- real data modeling
- production-style tooling and workflow

## 1:00-2:30 - Architecture overview

This is an npm workspace monorepo with:

- `apps/web` for the React UI
- `apps/api` for the Express API
- `shared/types` for shared contracts

The request flow is:
UI event -> API call -> route -> controller -> service -> Prisma -> PostgreSQL -> typed response -> React Query cache refresh.

## 2:30-4:00 - Backend design

Backend uses:

- Express middleware (`helmet`, `cors`, `morgan`, JSON)
- Zod for input validation
- Prisma for ORM and schema management
- JWT auth middleware + RBAC middleware

I intentionally kept controllers thin and placed business rules in services, which makes the code easier to test and reason about.

For example, task creation checks project access in the service layer so authorization logic is centralized.

## 4:00-5:30 - Data model

Main entities are `User`, `Project`, and `Task`.

Relationships:

- User owns many projects
- Project has many tasks
- Task has creator reference

Enums constrain valid states and priorities, which reduces invalid business states at runtime.

## 5:30-7:00 - Frontend design

Frontend uses React Query for server-state instead of manual state juggling.

Benefits:

- standardized loading/error/success handling
- cache invalidation after mutations
- less custom boilerplate

Auth context stores token/user, applies the Bearer token to axios, and gates protected routes.

Dashboard includes:

- project creation/listing
- project selection
- task creation
- task status progression
- admin-only users panel

## 7:00-8:30 - Security and access control

Auth and authorization are split:

- `requireAuth` verifies JWT and user identity
- `requireRole('ADMIN')` enforces role restriction
- ownership checks ensure members only touch their own project data

This prevents users from accessing data only by guessing IDs.

## 8:30-9:30 - Delivery quality

GitHub Actions runs lint, typecheck, tests, and build on push/PR.

I also included Docker artifacts for API + Postgres, and local setup instructions.

That demonstrates I can think beyond coding into developer experience and reliability.

## 9:30-10:00 - What I’d do next

Next steps:

- refresh token rotation with secure cookies
- invitation-based project collaboration
- deployment + observability (logs, metrics, traces)
- integration tests for critical routes

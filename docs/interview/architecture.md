# Architecture Talk Track

Use this as your architecture explanation during interviews.

## 1. System overview

This is a fullstack monorepo with three main packages:

- `apps/web`: React frontend
- `apps/api`: Express backend
- `shared/types`: shared TypeScript contracts

The frontend communicates with the backend over REST. The backend uses Prisma to persist data in PostgreSQL.

## 2. Request lifecycle (end-to-end)

Example: creating a task from the dashboard.

1. User submits `TaskForm` in `apps/web/src/components/task-form.tsx`.
2. Frontend calls `POST /api/projects/:projectId/tasks` via axios in `apps/web/src/lib/api.ts`.
3. Backend route in `apps/api/src/routes/project.routes.ts` matches request.
4. `requireAuth` middleware verifies JWT and attaches user context.
5. Controller parses payload with Zod (`createTaskSchema`).
6. Service enforces business rules:
   - project exists
   - user has access (owner or admin)
7. Prisma inserts row in `Task` table.
8. Response returns typed payload.
9. React Query invalidates tasks query and refetches updated data.

## 3. Why layered backend design

I separated route/controller/service layers to keep concerns clear:

- Routes: URL mapping and middleware ordering
- Controllers: HTTP parsing/response concerns
- Services: business logic and database calls

This improves testability and avoids putting business logic directly in route handlers.

## 4. Authentication and authorization

Authentication:

- JWT issued at login/register
- token includes `userId`, `email`, `role`
- frontend stores token and sends `Authorization: Bearer ...`

Authorization:

- RBAC middleware `requireRole('ADMIN')` for admin endpoints
- Ownership checks in services for project/task access

## 5. Database model choices

Core entities:

- `User`
- `Project` (owned by user)
- `Task` (belongs to project, createdBy user)

Enums constrain allowed states:

- `UserRole`
- `ProjectStatus`
- `TaskStatus`
- `TaskPriority`

Indexes added on common access patterns to keep project/task queries efficient.

## 6. Frontend state strategy

I used React Query for server-state:

- query caching
- mutation flows
- targeted invalidation after writes

This avoids manual state synchronization bugs after create/update operations.

## 7. CI and delivery quality

GitHub Actions pipeline runs lint, typecheck, test, and build on push/PR.

This acts as a quality gate before merge and demonstrates production-style discipline.

## 8. Known tradeoffs

- Current auth is stateless JWT only (no refresh rotation yet)
- RBAC is simple role-based, not full policy-based auth
- No background jobs/websockets yet

These are deliberate scope limits for an interview-ready MVP.

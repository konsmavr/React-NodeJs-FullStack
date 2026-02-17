# Deep-Dive Interview Q&A

## Architecture

### Q: Why did you choose a monorepo?
A: To share TS contracts and tooling across apps, reduce duplication, and keep frontend/backend changes coordinated in one PR.

### Q: Why separate controller and service layers?
A: Controllers stay focused on HTTP concerns, while services hold business logic and data access. This improves maintainability and testability.

## Frontend

### Q: Why React Query instead of plain useEffect fetch?
A: React Query gives standardized caching, invalidation, and mutation state management, which prevents stale data and duplicated loading/error logic.

### Q: How do you handle auth on the frontend?
A: I persist auth payload in localStorage, set axios Bearer headers globally, and redirect unauthenticated users away from protected pages.

## Backend

### Q: Where is validation done?
A: Input validation is done with Zod schemas in controllers before service logic executes. Env vars are also validated with Zod at startup.

### Q: How is RBAC implemented?
A: JWT contains role, `requireAuth` attaches user context, and `requireRole` middleware protects admin routes. Ownership checks in services protect resource-level access.

### Q: Why not put all checks in middleware?
A: Role-level checks fit middleware, but resource ownership often depends on DB lookups and belongs in services where business logic already lives.

## Database

### Q: Why Prisma?
A: Type-safe queries, schema-as-code, and straightforward iteration on data models. It also reduces SQL string errors in application code.

### Q: Why enums for statuses and priorities?
A: They enforce allowed states at schema level and reduce invalid transitions or typo bugs.

### Q: How would you scale this model?
A: Add pagination, query filtering, stronger indexes, and possibly partitioning strategies depending on growth patterns.

## Security

### Q: Is localStorage for JWT ideal?
A: It’s acceptable for a portfolio MVP but not ideal for high-security apps. I’d move to short-lived access tokens + refresh tokens in httpOnly cookies.

### Q: How do you prevent horizontal privilege escalation?
A: Service layer verifies ownership on project/task operations, and admins are explicitly allowed by role.

## DevOps and CI

### Q: What does your CI pipeline protect against?
A: It blocks regressions in style, types, tests, and builds before merge, improving reliability and team confidence.

### Q: How would you improve deployment readiness?
A: Add environment-specific config validation, migration strategy in deploy pipeline, health/readiness checks, and centralized logging/monitoring.

## Testing

### Q: What do you currently test and what is missing?
A: Baseline tests exist; next priority is integration tests for auth and RBAC-protected routes plus frontend interaction tests around dashboard workflows.

## Troubleshooting story (great interview point)

### Q: Tell me about a bug you fixed.
A: Seeding failed due to incorrect Prisma `upsert` usage (`data` instead of `create`). I fixed the seed script and verified end-to-end login afterward.

## Product thinking

### Q: Why this portfolio feature?
A: Task workflow is simple enough for a clean demo but rich enough to show auth, authorization, relational modeling, state updates, and UI interaction.

### Q: What business value could this evolve into?
A: It can become a lightweight team execution product with collaboration, analytics, and workflow automation.

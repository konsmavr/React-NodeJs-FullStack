# 2-Minute Interview Pitch

I built a fullstack monorepo project to demonstrate practical production patterns.

On the frontend, I used React with TypeScript, Vite, Tailwind, React Router, and React Query.
On the backend, I used Node.js with Express, TypeScript, Prisma, and PostgreSQL.
I also added JWT auth, role-based access control, and CI via GitHub Actions.

The core feature is a project task workflow. Users can create projects, add tasks with priority, and move tasks across statuses like TODO, IN_PROGRESS, and DONE. Admin users can access an admin-only users endpoint and panel to demonstrate RBAC.

Architecturally, I used a layered backend structure: routes, controllers, and services.
Routes define endpoints and middleware, controllers handle HTTP concerns and validation, and services contain business rules and Prisma data access.

One design choice I’m proud of is sharing TypeScript contracts across frontend and backend through a shared package, which reduces API contract drift.

I also implemented CI checks for linting, type safety, tests, and build, so every push or PR is validated.

If I extended this next, I’d add refresh token rotation, collaborative project membership, and deployment with monitoring.

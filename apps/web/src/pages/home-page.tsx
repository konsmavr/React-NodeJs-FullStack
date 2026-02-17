import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Career-focused template</p>
        <h1 className="font-display text-4xl leading-tight">
          Build a portfolio-grade fullstack app while learning best practices.
        </h1>
        <p className="text-slate-300">
          This starter includes auth, database migrations, typed shared contracts, testing, and deployment-ready structure.
        </p>
        <div className="flex gap-3">
          <Link to="/register" className="rounded bg-cyan-500 px-4 py-2 font-medium text-slate-900">
            Start now
          </Link>
          <Link to="/dashboard" className="rounded border border-slate-700 px-4 py-2 text-slate-200">
            View dashboard
          </Link>
        </div>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="font-display text-xl">What you will practice</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>REST API with JWT auth and input validation</li>
          <li>Relational data modeling with Prisma</li>
          <li>Reusable UI + React Query state management</li>
          <li>Testing and code quality tooling in monorepo setup</li>
        </ul>
      </div>
    </section>
  );
}

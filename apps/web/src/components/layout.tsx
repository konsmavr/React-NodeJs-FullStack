import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-display text-xl text-cyan-300">
            Fullstack Career Starter
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <span className="text-slate-300">{user.name}</span>
                <button
                  onClick={logout}
                  className="rounded bg-slate-800 px-3 py-1.5 text-slate-100 hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="text-slate-300 hover:text-white" to="/login">
                  Login
                </Link>
                <Link className="text-slate-300 hover:text-white" to="/register">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

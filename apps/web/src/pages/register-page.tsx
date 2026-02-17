import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="mx-auto max-w-md space-y-3 rounded-lg border border-slate-800 bg-slate-900/70 p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        try {
          await register(form);
          navigate('/dashboard');
        } catch {
          setError('Could not create account');
        }
      }}
    >
      <h1 className="font-display text-2xl">Create account</h1>
      <input
        className="w-full rounded bg-slate-800 px-3 py-2"
        placeholder="Name"
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
      />
      <input
        className="w-full rounded bg-slate-800 px-3 py-2"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
      />
      <input
        className="w-full rounded bg-slate-800 px-3 py-2"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button type="submit" className="w-full rounded bg-cyan-500 px-3 py-2 font-medium text-slate-900">
        Register
      </button>
    </form>
  );
}

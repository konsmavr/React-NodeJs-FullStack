import { useState } from 'react';

interface Props {
  onSubmit: (payload: {
    title: string;
    summary: string;
    status: 'PLANNED' | 'ACTIVE' | 'DONE';
  }) => Promise<void>;
}

export function ProjectForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState<'PLANNED' | 'ACTIVE' | 'DONE'>('PLANNED');

  return (
    <form
      className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/70 p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({ title, summary, status });
        setTitle('');
        setSummary('');
        setStatus('PLANNED');
      }}
    >
      <h3 className="font-display text-lg">Create project</h3>
      <input
        className="w-full rounded bg-slate-800 px-3 py-2"
        placeholder="Project title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        className="w-full rounded bg-slate-800 px-3 py-2"
        placeholder="Short summary"
        rows={3}
        value={summary}
        onChange={(event) => setSummary(event.target.value)}
      />
      <select
        className="w-full rounded bg-slate-800 px-3 py-2"
        value={status}
        onChange={(event) => setStatus(event.target.value as 'PLANNED' | 'ACTIVE' | 'DONE')}
      >
        <option value="PLANNED">Planned</option>
        <option value="ACTIVE">Active</option>
        <option value="DONE">Done</option>
      </select>
      <button
        type="submit"
        className="rounded bg-cyan-500 px-3 py-2 font-medium text-slate-900 hover:bg-cyan-400"
      >
        Save project
      </button>
    </form>
  );
}

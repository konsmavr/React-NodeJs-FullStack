import { useState } from 'react';

interface Props {
  onSubmit: (payload: {
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  }) => Promise<void>;
}

export function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');

  return (
    <form
      className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/70 p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit({ title, description, priority });
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
      }}
    >
      <h3 className="font-display text-lg">Create task</h3>
      <input
        className="w-full rounded bg-slate-800 px-3 py-2"
        placeholder="Task title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        className="w-full rounded bg-slate-800 px-3 py-2"
        placeholder="Task description"
        rows={3}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <select
        className="w-full rounded bg-slate-800 px-3 py-2"
        value={priority}
        onChange={(event) => setPriority(event.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
      >
        <option value="LOW">Low priority</option>
        <option value="MEDIUM">Medium priority</option>
        <option value="HIGH">High priority</option>
      </select>
      <button
        type="submit"
        className="rounded bg-cyan-500 px-3 py-2 font-medium text-slate-900 hover:bg-cyan-400"
      >
        Save task
      </button>
    </form>
  );
}

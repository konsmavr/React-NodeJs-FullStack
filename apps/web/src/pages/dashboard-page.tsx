import type { Project, Task, User } from '@fullstack/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ProjectForm } from '../components/project-form';
import { TaskForm } from '../components/task-form';
import { useAuth } from '../lib/auth-context';
import { api } from '../lib/api';

const nextStatus = (status: Task['status']): Task['status'] => {
  if (status === 'TODO') return 'IN_PROGRESS';
  if (status === 'IN_PROGRESS') return 'DONE';
  return 'TODO';
};

export function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get<Project[]>('/projects');
      return response.data;
    },
    enabled: Boolean(user)
  });

  const selectedProject = useMemo(() => {
    if (!projectsQuery.data?.length) return null;
    return (
      projectsQuery.data.find((project) => project.id === selectedProjectId) ??
      projectsQuery.data[0]
    );
  }, [projectsQuery.data, selectedProjectId]);

  const tasksQuery = useQuery({
    queryKey: ['tasks', selectedProject?.id],
    queryFn: async () => {
      const response = await api.get<Task[]>(`/projects/${selectedProject!.id}/tasks`);
      return response.data;
    },
    enabled: Boolean(user && selectedProject)
  });

  const adminUsersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await api.get<User[]>('/admin/users');
      return response.data;
    },
    enabled: user?.role === 'ADMIN'
  });

  const createProject = useMutation({
    mutationFn: async (payload: { title: string; summary: string; status: 'PLANNED' | 'ACTIVE' | 'DONE' }) => {
      await api.post('/projects', payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const createTask = useMutation({
    mutationFn: async (payload: { title: string; description: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' }) => {
      if (!selectedProject) return;
      await api.post(`/projects/${selectedProject.id}/tasks`, payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', selectedProject?.id] });
    }
  });

  const updateTaskStatus = useMutation({
    mutationFn: async (task: Task) => {
      await api.patch(`/projects/${task.projectId}/tasks/${task.id}/status`, {
        status: nextStatus(task.status)
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', selectedProject?.id] });
    }
  });

  if (!user) return <Navigate to="/login" replace />;

  return (
    <section className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <ProjectForm onSubmit={createProject.mutateAsync} />
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="font-display text-xl">Your projects</h2>
          {projectsQuery.isLoading ? <p className="mt-3 text-slate-300">Loading...</p> : null}
          <ul className="mt-3 space-y-3">
            {projectsQuery.data?.map((project) => {
              const isSelected = selectedProject?.id === project.id;
              return (
                <li
                  key={project.id}
                  className={`cursor-pointer rounded border p-3 ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-900/20'
                      : 'border-slate-800 bg-slate-800/50'
                  }`}
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{project.title}</h3>
                    <span className="text-xs uppercase tracking-wide text-cyan-300">{project.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{project.summary}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {selectedProject ? (
        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          <TaskForm onSubmit={createTask.mutateAsync} />
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
            <h2 className="font-display text-xl">Tasks for {selectedProject.title}</h2>
            {tasksQuery.isLoading ? <p className="mt-3 text-slate-300">Loading tasks...</p> : null}
            <ul className="mt-3 space-y-3">
              {tasksQuery.data?.map((task) => (
                <li key={task.id} className="rounded border border-slate-800 bg-slate-800/50 p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{task.title}</h3>
                    <button
                      className="rounded bg-slate-700 px-2 py-1 text-xs uppercase tracking-wide hover:bg-slate-600"
                      onClick={() => updateTaskStatus.mutate(task)}
                    >
                      {task.status}
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{task.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-amber-300">Priority: {task.priority}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {user.role === 'ADMIN' ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="font-display text-xl">Admin panel: users</h2>
          <ul className="mt-3 space-y-2">
            {adminUsersQuery.data?.map((adminUser) => (
              <li key={adminUser.id} className="rounded border border-slate-800 bg-slate-800/50 p-3">
                <div className="flex items-center justify-between">
                  <span>{adminUser.name}</span>
                  <span className="text-xs uppercase tracking-wide text-cyan-300">{adminUser.role}</span>
                </div>
                <p className="text-sm text-slate-300">{adminUser.email}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

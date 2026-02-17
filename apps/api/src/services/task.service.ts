import type { Task } from '@fullstack/types';
import { prisma } from '../config/db.js';
import type { CreateTaskInput, UpdateTaskStatusInput } from '../models/task.schema.js';
import { HttpError } from '../utils/httpError.js';

const toTask = (task: {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  projectId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}): Task => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  projectId: task.projectId,
  createdById: task.createdById,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString()
});

const assertProjectAccess = async (projectId: string, userId: string, isAdmin: boolean) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new HttpError(404, 'Project not found');

  if (!isAdmin && project.ownerId !== userId) {
    throw new HttpError(403, 'You are not allowed to access this project');
  }
};

export const createTask = async (
  projectId: string,
  userId: string,
  isAdmin: boolean,
  input: CreateTaskInput
): Promise<Task> => {
  await assertProjectAccess(projectId, userId, isAdmin);

  const task = await prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      projectId,
      createdById: userId
    }
  });

  return toTask(task);
};

export const listTasks = async (
  projectId: string,
  userId: string,
  isAdmin: boolean
): Promise<Task[]> => {
  await assertProjectAccess(projectId, userId, isAdmin);

  const tasks = await prisma.task.findMany({
    where: { projectId },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }]
  });

  return tasks.map(toTask);
};

export const updateTaskStatus = async (
  projectId: string,
  taskId: string,
  userId: string,
  isAdmin: boolean,
  input: UpdateTaskStatusInput
): Promise<Task> => {
  await assertProjectAccess(projectId, userId, isAdmin);

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.projectId !== projectId) {
    throw new HttpError(404, 'Task not found');
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status: input.status }
  });

  return toTask(updated);
};

import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { createTaskSchema, updateTaskStatusSchema } from '../models/task.schema.js';
import * as taskService from '../services/task.service.js';

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const payload = createTaskSchema.parse(req.body);
  const task = await taskService.createTask(
    req.params.projectId,
    req.user.id,
    req.user.role === 'ADMIN',
    payload
  );

  return res.status(201).json(task);
};

export const listTasks = async (req: AuthenticatedRequest, res: Response) => {
  const tasks = await taskService.listTasks(
    req.params.projectId,
    req.user.id,
    req.user.role === 'ADMIN'
  );

  return res.status(200).json(tasks);
};

export const updateTaskStatus = async (req: AuthenticatedRequest, res: Response) => {
  const payload = updateTaskStatusSchema.parse(req.body);
  const task = await taskService.updateTaskStatus(
    req.params.projectId,
    req.params.taskId,
    req.user.id,
    req.user.role === 'ADMIN',
    payload
  );

  return res.status(200).json(task);
};

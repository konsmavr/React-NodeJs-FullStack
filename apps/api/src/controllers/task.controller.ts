import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { createTaskSchema, updateTaskStatusSchema } from '../models/task.schema.js';
import * as taskService from '../services/task.service.js';

export const createTask = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const payload = createTaskSchema.parse(req.body);
  const projectId = String(req.params.projectId);

  const task = await taskService.createTask(
    projectId,
    authReq.user.id,
    authReq.user.role === 'ADMIN',
    payload
  );

  res.status(201).json(task);
};

export const listTasks = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const projectId = String(req.params.projectId);

  const tasks = await taskService.listTasks(
    projectId,
    authReq.user.id,
    authReq.user.role === 'ADMIN'
  );

  res.status(200).json(tasks);
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const payload = updateTaskStatusSchema.parse(req.body);
  const projectId = String(req.params.projectId);
  const taskId = String(req.params.taskId);

  const task = await taskService.updateTaskStatus(
    projectId,
    taskId,
    authReq.user.id,
    authReq.user.role === 'ADMIN',
    payload
  );

  res.status(200).json(task);
};

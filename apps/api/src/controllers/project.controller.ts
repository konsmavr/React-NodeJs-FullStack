import type { Request, Response } from 'express';
import { createProjectSchema } from '../models/project.schema.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import * as projectService from '../services/project.service.js';

export const createProject = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const payload = createProjectSchema.parse(req.body);
  const project = await projectService.createProject(authReq.user.id, payload);
  res.status(201).json(project);
};

export const listProjects = async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const projects = await projectService.listProjects(authReq.user.id);
  res.status(200).json(projects);
};

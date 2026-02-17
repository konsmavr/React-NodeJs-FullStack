import type { Response } from 'express';
import { createProjectSchema } from '../models/project.schema.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import * as projectService from '../services/project.service.js';

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  const payload = createProjectSchema.parse(req.body);
  const project = await projectService.createProject(req.user.id, payload);
  return res.status(201).json(project);
};

export const listProjects = async (req: AuthenticatedRequest, res: Response) => {
  const projects = await projectService.listProjects(req.user.id);
  return res.status(200).json(projects);
};

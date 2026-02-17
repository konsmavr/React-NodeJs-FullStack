import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import * as taskController from '../controllers/task.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const projectRouter = Router();

projectRouter.use(requireAuth);
projectRouter.get('/', projectController.listProjects);
projectRouter.post('/', projectController.createProject);
projectRouter.get('/:projectId/tasks', taskController.listTasks);
projectRouter.post('/:projectId/tasks', taskController.createTask);
projectRouter.patch('/:projectId/tasks/:taskId/status', taskController.updateTaskStatus);

import type { Request, Response } from 'express';
import * as adminService from '../services/admin.service.js';

export const listUsers = async (_req: Request, res: Response) => {
  const users = await adminService.listUsers();
  return res.status(200).json(users);
};

import type { Request, Response } from 'express';
import { loginSchema, registerSchema } from '../models/auth.schema.js';
import * as authService from '../services/auth.service.js';

export const register = async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body);
  const result = await authService.register(payload);
  return res.status(201).json(result);
};

export const login = async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);
  const result = await authService.login(payload);
  return res.status(200).json(result);
};

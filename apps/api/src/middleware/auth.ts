import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '@fullstack/types';
import { verifyToken } from '../utils/jwt.js';
import { HttpError } from '../utils/httpError.js';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new HttpError(401, 'Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);

  (req as AuthenticatedRequest).user = {
    id: payload.userId,
    email: payload.email,
    role: payload.role
  };

  next();
};

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      throw new HttpError(401, 'Authentication required');
    }

    if (!roles.includes(authReq.user.role)) {
      throw new HttpError(403, 'Forbidden');
    }

    next();
  };

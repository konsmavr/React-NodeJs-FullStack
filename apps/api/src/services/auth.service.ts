import bcrypt from 'bcryptjs';
import type { AuthResponse } from '@fullstack/types';
import { prisma } from '../config/db.js';
import type { LoginInput, RegisterInput } from '../models/auth.schema.js';
import { HttpError } from '../utils/httpError.js';
import { signToken } from '../utils/jwt.js';

const toAuthResponse = (user: {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MEMBER';
  createdAt: Date;
}): AuthResponse => ({
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString()
  },
  token: signToken({ userId: user.id, email: user.email, role: user.role })
});

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new HttpError(409, 'Email already in use');

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash
    }
  });

  return toAuthResponse(user);
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new HttpError(401, 'Invalid credentials');

  const passwordOk = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordOk) throw new HttpError(401, 'Invalid credentials');

  return toAuthResponse(user);
};

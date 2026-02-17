import type { User } from '@fullstack/types';
import { prisma } from '../config/db.js';

export const listUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });

  return users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString()
  }));
};

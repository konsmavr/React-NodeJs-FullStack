import type { Project } from '@fullstack/types';
import { prisma } from '../config/db.js';
import type { CreateProjectInput } from '../models/project.schema.js';

const toProject = (project: {
  id: string;
  title: string;
  summary: string;
  status: 'PLANNED' | 'ACTIVE' | 'DONE';
  ownerId: string;
  createdAt: Date;
}): Project => ({
  id: project.id,
  title: project.title,
  summary: project.summary,
  status: project.status,
  ownerId: project.ownerId,
  createdAt: project.createdAt.toISOString()
});

export const createProject = async (
  ownerId: string,
  input: CreateProjectInput
): Promise<Project> => {
  const project = await prisma.project.create({
    data: {
      title: input.title,
      summary: input.summary,
      status: input.status,
      ownerId
    }
  });

  return toProject(project);
};

export const listProjects = async (ownerId: string): Promise<Project[]> => {
  const projects = await prisma.project.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' }
  });

  return projects.map(toProject);
};

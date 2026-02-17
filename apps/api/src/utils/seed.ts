import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';

async function run() {
  const adminEmail = 'admin@example.com';
  const memberEmail = 'member@example.com';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Portfolio Admin',
      role: 'ADMIN',
      passwordHash: await bcrypt.hash('Password123!', 10)
    }
  });

  await prisma.user.upsert({
    where: { email: memberEmail },
    update: {},
    create: {
      email: memberEmail,
      name: 'Portfolio Member',
      role: 'MEMBER',
      passwordHash: await bcrypt.hash('Password123!', 10)
    }
  });

  const project = await prisma.project.upsert({
    where: { id: 'seed-career-project' },
    update: {},
    create: {
      id: 'seed-career-project',
      title: 'Fullstack Career Tracker',
      summary: 'Portfolio feature to track applications and interview stages.',
      status: 'ACTIVE',
      ownerId: admin.id
    }
  });

  await prisma.task.upsert({
    where: { id: 'seed-task-1' },
    update: {},
    create: {
      id: 'seed-task-1',
      title: 'Add company pipeline page',
      description: 'Build a board with stages for applied, interview, and offer.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      projectId: project.id,
      createdById: admin.id
    }
  });

  console.log('Seeded users and portfolio sample data.');
  console.log('Admin: admin@example.com / Password123!');
  console.log('Member: member@example.com / Password123!');
}

run()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

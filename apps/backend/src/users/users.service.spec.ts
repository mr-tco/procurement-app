import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const prisma = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    }
  } as unknown as PrismaService;

  const service = new UsersService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists users without password', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([
      { id: '1', email: 'a@a.com', fullName: 'A', password: 'x', role: 'USER', isActive: true }
    ]);

    const users = await service.findAll();
    expect((users[0] as { password?: string }).password).toBeUndefined();
  });

  it('throws when updating missing user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.updateStatus('x', false)).rejects.toBeInstanceOf(NotFoundException);
  });
});

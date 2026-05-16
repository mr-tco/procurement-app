import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn()
}));

describe('AuthService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  } as unknown as PrismaService;

  const jwtService = {
    signAsync: jest.fn().mockResolvedValue('token')
  } as unknown as JwtService;

  const service = new AuthService(prisma, jwtService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'user@test.com',
      fullName: 'User',
      password: 'hashed-password',
      role: 'USER',
      isActive: true
    });

    const result = await service.register({
      email: 'user@test.com',
      fullName: 'User',
      password: 'password'
    });

    expect(result.email).toBe('user@test.com');
  });

  it('throws when registering existing email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

    await expect(
      service.register({
        email: 'user@test.com',
        fullName: 'User',
        password: 'password'
      })
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws on invalid login credentials', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.login('user@test.com', 'wrong')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns token for valid login', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'user@test.com',
      fullName: 'User',
      password: 'hashed-password',
      role: 'USER',
      isActive: true
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.login('user@test.com', 'password');

    expect(result.accessToken).toBe('token');
  });
});

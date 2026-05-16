import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private sanitize(user: User): SafeUser {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return users.map((user) => this.sanitize(user));
  }

  async updateStatus(id: string, isActive: boolean): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updated = await this.prisma.user.update({ where: { id }, data: { isActive } });
    return this.sanitize(updated);
  }

  async assignRole(id: string, role: Role): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updated = await this.prisma.user.update({ where: { id }, data: { role } });
    return this.sanitize(updated);
  }
}

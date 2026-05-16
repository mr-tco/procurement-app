import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

type SafeUser = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto): Promise<SafeUser> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ForbiddenException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        password: hashedPassword,
        role: Role.USER
      }
    });

    const { password: _password, ...result } = user;
    return result;
  }

  async login(email: string, password: string): Promise<{ accessToken: string; user: SafeUser }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User account is deactivated');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const { password: _password, ...safeUser } = user;

    return { accessToken, user: safeUser };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMiDto } from './dto/create-mi.dto';
import { UpdateMiDto } from './dto/update-mi.dto';

@Injectable()
export class MisService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMiDto) {
    return this.prisma.mi.create({
      data: { ...dto, receivedAt: new Date(dto.receivedAt) } as never
    });
  }

  findAll() {
    return this.prisma.mi.findMany({ include: { indent: true }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.mi.findUnique({ where: { id }, include: { indent: true } });
  }

  update(id: string, dto: UpdateMiDto) {
    const payload = {
      ...dto,
      receivedAt: dto.receivedAt ? new Date(dto.receivedAt) : undefined
    };
    return this.prisma.mi.update({ where: { id }, data: payload as never });
  }

  remove(id: string) {
    return this.prisma.mi.delete({ where: { id } });
  }
}

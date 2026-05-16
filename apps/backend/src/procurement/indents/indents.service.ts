import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIndentDto } from './dto/create-indent.dto';
import { UpdateIndentDto } from './dto/update-indent.dto';

@Injectable()
export class IndentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateIndentDto, requestedById: string) {
    return this.prisma.indent.create({ data: { ...dto, requestedById } as never });
  }

  findAll() {
    return this.prisma.indent.findMany({ include: { item: true, requestedBy: true }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.indent.findUnique({ where: { id }, include: { item: true, requestedBy: true, mis: true } });
  }

  update(id: string, dto: UpdateIndentDto) {
    return this.prisma.indent.update({ where: { id }, data: dto as never });
  }

  remove(id: string) {
    return this.prisma.indent.delete({ where: { id } });
  }
}

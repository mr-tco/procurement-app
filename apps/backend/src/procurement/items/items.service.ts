import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateItemDto) {
    return this.prisma.item.create({ data: dto as never });
  }

  findAll() {
    return this.prisma.item.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.item.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateItemDto) {
    return this.prisma.item.update({ where: { id }, data: dto as never });
  }

  remove(id: string) {
    return this.prisma.item.delete({ where: { id } });
  }
}

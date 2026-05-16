import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';

@Injectable()
export class RfqsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateRfqDto) {
    return this.prisma.rfq.create({ data: dto as never });
  }

  findAll() {
    return this.prisma.rfq.findMany({ include: { item: true, vendor: true }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.rfq.findUnique({ where: { id }, include: { item: true, vendor: true } });
  }

  update(id: string, dto: UpdateRfqDto) {
    return this.prisma.rfq.update({ where: { id }, data: dto as never });
  }

  remove(id: string) {
    return this.prisma.rfq.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateVendorDto) {
    return this.prisma.vendor.create({ data: dto as never });
  }

  findAll() {
    return this.prisma.vendor.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.vendor.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateVendorDto) {
    return this.prisma.vendor.update({ where: { id }, data: dto as never });
  }

  remove(id: string) {
    return this.prisma.vendor.delete({ where: { id } });
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateRfqDto } from './dto/create-rfq.dto';
import { UpdateRfqDto } from './dto/update-rfq.dto';
import { RfqsService } from './rfqs.service';

@Controller('rfqs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RfqsController {
  constructor(private readonly rfqsService: RfqsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateRfqDto) {
    return this.rfqsService.create(dto);
  }

  @Get()
  findAll() {
    return this.rfqsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rfqsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateRfqDto) {
    return this.rfqsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.rfqsService.remove(id);
  }
}

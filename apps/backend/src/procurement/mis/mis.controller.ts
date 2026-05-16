import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateMiDto } from './dto/create-mi.dto';
import { UpdateMiDto } from './dto/update-mi.dto';
import { MisService } from './mis.service';

@Controller('mis')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MisController {
  constructor(private readonly misService: MisService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateMiDto) {
    return this.misService.create(dto);
  }

  @Get()
  findAll() {
    return this.misService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.misService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateMiDto) {
    return this.misService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.misService.remove(id);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateIndentDto } from './dto/create-indent.dto';
import { UpdateIndentDto } from './dto/update-indent.dto';
import { IndentsService } from './indents.service';

@Controller('indents')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class IndentsController {
  constructor(private readonly indentsService: IndentsService) {}

  @Post()
  create(@Body() dto: CreateIndentDto, @Req() req: { user: { sub: string } }) {
    return this.indentsService.create(dto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.indentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.indentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateIndentDto) {
    return this.indentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.indentsService.remove(id);
  }
}

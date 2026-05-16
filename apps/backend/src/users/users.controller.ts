import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.usersService.updateStatus(id, dto.isActive);
  }

  @Patch(':id/role')
  @Roles('ADMIN')
  assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto) {
    return this.usersService.assignRole(id, dto.role);
  }
}

import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class AssignRoleDto {
  @IsEnum(Role)
  role!: Role;
}

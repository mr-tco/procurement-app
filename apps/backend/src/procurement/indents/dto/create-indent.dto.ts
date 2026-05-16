import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateIndentDto {
  @IsString()
  @IsNotEmpty()
  requestNumber!: string;

  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsIn(['OPEN', 'APPROVED', 'REJECTED'])
  status?: 'OPEN' | 'APPROVED' | 'REJECTED';
}

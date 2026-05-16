import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateIndentDto {
  @IsString()
  @IsOptional()
  requestNumber?: string;

  @IsString()
  @IsOptional()
  itemId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsOptional()
  @IsIn(['OPEN', 'APPROVED', 'REJECTED'])
  status?: 'OPEN' | 'APPROVED' | 'REJECTED';
}

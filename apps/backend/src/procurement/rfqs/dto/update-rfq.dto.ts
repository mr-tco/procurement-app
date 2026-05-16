import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateRfqDto {
  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  itemId?: string;

  @IsString()
  @IsOptional()
  vendorId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  quotedPrice?: number;

  @IsOptional()
  @IsIn(['DRAFT', 'SENT', 'CLOSED'])
  status?: 'DRAFT' | 'SENT' | 'CLOSED';
}

import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRfqDto {
  @IsString()
  @IsNotEmpty()
  number!: string;

  @IsString()
  @IsNotEmpty()
  itemId!: string;

  @IsString()
  @IsNotEmpty()
  vendorId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  quotedPrice!: number;

  @IsOptional()
  @IsIn(['DRAFT', 'SENT', 'CLOSED'])
  status?: 'DRAFT' | 'SENT' | 'CLOSED';
}

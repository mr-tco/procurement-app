import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice!: number;
}

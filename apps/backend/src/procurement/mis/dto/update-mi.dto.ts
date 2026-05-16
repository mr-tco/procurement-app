import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateMiDto {
  @IsString()
  @IsOptional()
  number?: string;

  @IsString()
  @IsOptional()
  indentId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  receivedQty?: number;

  @IsDateString()
  @IsOptional()
  receivedAt?: string;
}

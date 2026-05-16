import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateMiDto {
  @IsString()
  @IsNotEmpty()
  number!: string;

  @IsString()
  @IsNotEmpty()
  indentId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  receivedQty!: number;

  @IsDateString()
  receivedAt!: string;
}

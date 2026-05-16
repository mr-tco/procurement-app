import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

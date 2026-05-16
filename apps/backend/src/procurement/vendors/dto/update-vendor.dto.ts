import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateVendorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

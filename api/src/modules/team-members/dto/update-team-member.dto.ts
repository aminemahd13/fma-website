import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateTeamMemberDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  imageSrc?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  linkedinSrc?: string;

  @IsOptional()
  @IsString()
  portfolioSrc?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}
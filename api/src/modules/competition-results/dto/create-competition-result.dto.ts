import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { MedalType } from '../entities/competition-result.entity';

export class CreateCompetitionResultDto {
  @IsNotEmpty()
  @IsNumber()
  rank: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  school: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsEnum(MedalType)
  medal?: MedalType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 
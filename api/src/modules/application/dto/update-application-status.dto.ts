import { IsOptional, IsString } from 'class-validator';
import { FileStatus, Status } from '../entities/application-status.entity';

export class UpdateApplicationStatusDto {
  @IsString()
  @IsOptional()
  status: Status;

  @IsString()
  @IsOptional()
  cnieStatus: FileStatus;

  @IsString()
  @IsOptional()
  schoolCertificateStatus: FileStatus;

  @IsString()
  @IsOptional()
  regulationsStatus: FileStatus;

  @IsString()
  @IsOptional()
  gradesStatus: FileStatus;
}

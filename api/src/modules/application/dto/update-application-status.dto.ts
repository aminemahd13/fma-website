import { IsOptional, IsString } from 'class-validator';
import { FileStatus, Status } from '../entities/application-status.entity';

export class UpdateApplicationStatusDto {
  @IsString()
  @IsOptional()
  status: Status;

  @IsString()
  @IsOptional()
  parentIdStatus: FileStatus;
  
  @IsString()
  @IsOptional()
  birthCertificateStatus: FileStatus;
  
  @IsString()
  @IsOptional()
  schoolCertificateStatus: FileStatus;

  @IsString()
  @IsOptional()
  regulationsStatus: FileStatus;

  @IsString()
  @IsOptional()
  gradesStatus: FileStatus;
  
  @IsString()
  @IsOptional()
  parentalAuthorizationStatus: FileStatus;
  
  @IsString()
  @IsOptional()
  imageRightsStatus: FileStatus;
  
  @IsString()
  @IsOptional()
  reportStatus: FileStatus;
}

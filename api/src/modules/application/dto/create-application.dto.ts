import { IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  /* Personal informations */
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  dateOfBirth: Date;

  @IsString()
  @IsOptional()
  identityCardNumber: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  region: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  guardianFullName: string;

  @IsString()
  @IsOptional()
  guardianPhoneNumber: string;

  @IsString()
  @IsOptional()
  relationshipWithGuardian: string;

  @IsString()
  @IsOptional()
  specialConditions: string;

  /* Education */
  @IsString()
  @IsOptional()
  educationLevel: string;

  @IsString()
  @IsOptional()
  educationField: string;

  @IsString()
  @IsOptional()
  highschool: string;

  @IsString()
  @IsOptional()
  averageGrade: string;

  @IsString()
  @IsOptional()
  mathAverageGrade: string;

  @IsString()
  @IsOptional()
  ranking: string;

  @IsString()
  @IsOptional()
  mathRanking: string;

  @IsString()
  @IsOptional()
  numberOfStudentsInClass: string;

  /* Competition */
  @IsString()
  @IsOptional()
  hasPreviouslyParticipated: string;

  @IsString()
  @IsOptional()
  previousCompetitions: string;

  @IsString()
  @IsOptional()
  hasPreviouslyParticipatedInMtym: string;

  @IsString()
  @IsOptional()
  motivations: string;

  @IsString()
  @IsOptional()
  comments: string;

  /* Files */
  @IsString()
  @IsOptional()
  cnieUrl: string;

  @IsString()
  @IsOptional()
  schoolCertificateUrl: string;

  @IsString()
  @IsOptional()
  gradesUrl: string;

  @IsString()
  @IsOptional()
  regulationsUrl: string;

  @IsString()
  @IsOptional()
  parentalAuthorizationUrl: string;
}

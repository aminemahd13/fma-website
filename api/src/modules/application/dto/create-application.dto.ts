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
  massarCode: string;

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
  parentCNIE: string;

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
  highschool: string;

  @IsString()
  @IsOptional()
  averageGrade: string;

  @IsString()
  @IsOptional()
  physicsAverageGrade: string;

  @IsString()
  @IsOptional()
  ranking: string;

  @IsString()
  @IsOptional()
  physicsRanking: string;


  /* Competition */
  @IsString()
  @IsOptional()
  hasPreviouslyParticipated: string;

  @IsString()
  @IsOptional()
  previousCompetitions: string;

  @IsString()
  @IsOptional()
  physicsOlympiadsParticipation: string;

  @IsString()
  @IsOptional()
  olympiadsTrainingSelection: string;

  @IsString()
  @IsOptional()
  comments: string;

  /* Files */
  @IsString()
  @IsOptional()
  parentIdUrl: string;

  @IsString()
  @IsOptional()
  birthCertificateUrl: string;

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

  @IsString()
  @IsOptional()
  imageRightsUrl: string;
}

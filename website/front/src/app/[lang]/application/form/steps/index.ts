import { Step } from "./step.type";

export const steps: Step[] = [
  {
    id: 'Étape 1',
    name: 'Informations Personnelles',
    fields: ['firstName', 'lastName', 'dateOfBirth', 'identityCardNumber', 'city', 'region', 'phoneNumber', 'guardianFullName', 'guardianPhoneNumber', 'relationshipWithGuardian', 'specialConditions']
  },
  {
    id: 'Étape 2',
    name: 'Éducation',
    fields: ['educationLevel', 'educationField', 'highschool', 'averageGrade', 'ranking', 'mathAverageGrade', 'mathRanking', 'numberOfStudentsInClass']
  },
  {
    id: 'Étape 3',
    name: 'Compétition',
    fields: ['hasPreviouslyParticipated', 'previousCompetitions', 'hasPreviouslyParticipatedInMtym', 'motivations', 'comments']
  },
  {
    id: 'Étape 4',
    name: 'Uploads',
    fields: ['cnie', 'schoolCertificate', 'grades', 'regulations', 'parentalAuthorization']
  },
  { id: 'Étape 5', 
    name: 'Validation',
    fields: ['termsAgreement']
  }
];

export { PersonalInformationStep } from './personal-information-step'
export { EducationStep } from './education-step'
export { CompetitionStep } from "./competition-step"
export { UploadStep } from './upload-step'
export { ValidationStep } from './validation-step'


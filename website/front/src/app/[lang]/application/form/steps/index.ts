import { Step } from "./step.type";

export const steps: Step[] = [
  {
    id: 'Étape 1',
    name: 'Informations Personnelles',
    fields: ['firstName', 'lastName', 'dateOfBirth', 'massarCode', 'city', 'region', 'phoneNumber', 'guardianFullName', 'parentCNIE', 'guardianPhoneNumber', 'relationshipWithGuardian', 'specialConditions']
  },
  {
    id: 'Étape 2',
    name: 'Études',
    fields: ['highschool', 'averageGrade', 'physicsAverageGrade', 'ranking', 'physicsRanking']
  },
  {
    id: 'Étape 3',
    name: 'Feynman Moroccan Adventure',
    fields: ['hasPreviouslyParticipated', 'previousCompetitions', 'physicsOlympiadsParticipation', 'olympiadsTrainingSelection', 'comments']
  },
  {
    id: 'Étape 4',
    name: 'Documents',
    fields: ['schoolCertificate', 'grades'] // Simplified to only require the necessary documents
  },
  { 
    id: 'Étape 5', 
    name: 'Validation',
    fields: ['termsAgreement']
  }
];

export { PersonalInformationStep } from './personal-information-step'
export { EducationStep } from './education-step'
export { CompetitionStep } from "./competition-step"
export { UploadStep } from './upload-step'
export { ValidationStep } from './validation-step'


import { User } from 'src/modules/user/entities/user.entity';
import {
  regionLabels,
  relationshipWithGuardianLabels,
} from '../labels';

export const columns = [
  { header: 'Application Id', key: 'application-id', width: 10 },
  { header: 'Team Id', key: 'team-id', width: 10 },
  { header: 'Team Name', key: 'team-name', width: 20 },
  { header: 'First Name', key: 'first-name', width: 15 },
  { header: 'Last Name', key: 'last-name', width: 15 },
  { header: 'Email', key: 'email', width: 25 },
  { header: 'Date of Birth', key: 'dob', width: 15 },
  { header: 'Massar Code', key: 'massar-code', width: 12 },
  { header: 'City', key: 'city', width: 15 },
  { header: 'Region', key: 'region', width: 20 },
  { header: 'Phone number', key: 'phone-number', width: 20 },
  { header: 'Guardian Full Name', key: 'guardian-full-name', width: 25 },
  { header: 'Parent CNIE', key: 'parent-cnie', width: 15 },
  { header: 'Guardian Phone Number', key: 'guardian-phone-number', width: 25 },
  {
    header: 'Relationship With Guardian',
    key: 'relationship-with-guardian',
    width: 20,
  },
  { header: 'Special conditions', key: 'special conditions', width: 30 },

  { header: 'Highschool', key: 'highschool', width: 20 },
  { header: 'Average grade', key: 'average-grade', width: 15 },
  { header: 'Physics Average grade', key: 'physics-average-grade', width: 15 },
  { header: 'Ranking', key: 'ranking', width: 15 },
  { header: 'Physics Ranking', key: 'physics-ranking', width: 15 },


  {
    header: 'Have you participated in competitions before?',
    key: 'has-previously-participated',
    width: 15,
  },
  { header: 'Previous competitions', key: 'previous-competitions', width: 20 },
  {
    header: 'Physics olympiads participation',
    key: 'physics-olympiads-participation',
    width: 15,
  },
  { 
    header: 'Olympiads training selection', 
    key: 'olympiads-training-selection', 
    width: 15 
  },
  { header: 'Comments', key: 'comments', width: 30 },

  { header: 'Parent ID', key: 'parent-id', width: 10 },
  { header: 'Birth Certificate', key: 'birth-certificate', width: 10 },
  { header: 'School certificate', key: 'school-certificate', width: 10 },
  { header: 'Grades', key: 'grades', width: 10 },
  { header: 'Regulations', key: 'regulations', width: 10 },
  {
    header: 'Parental authorization',
    key: 'parental-authorization',
    width: 10,
  },
  {
    header: 'Image Rights',
    key: 'image-rights',
    width: 10,
  },
  { header: 'Status', key: 'status', width: 15 },
];

export const rowFactory = (users: any[], configService) => {
  const awsBucketName = configService.get('AWS_BUCKET_NAME');
  const awsBucketRegion = configService.get('AWS_BUCKET_REGION');
  const mapUser = (user: User) => {
    const application = user?.application;
    if (!application) return;

    return {
      id: application?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      dateOfBirth: new Date(application?.dateOfBirth),
      massarCode: application?.massarCode,
      city: application?.city,
      region: regionLabels[application?.region],
      phoneNumber: application?.phoneNumber,
      guardianFullName: application?.guardianFullName,
      parentCNIE: application?.parentCNIE,
      guardianPhoneNumber: application?.guardianPhoneNumber,
      relationshipWithGuardian:
        relationshipWithGuardianLabels[application?.relationshipWithGuardian],
      specialConditions: application?.specialConditions,

      highschool: application?.highschool,
      averageGrade: application?.averageGrade,
      physicsAverageGrade: application?.physicsAverageGrade,
      ranking: application?.ranking,
      physicsRanking: application?.physicsRanking,
      hasPreviouslyParticipated: application?.hasPreviouslyParticipated,
      previousCompetitions: application?.previousCompetitions,
      physicsOlympiadsParticipation: application?.physicsOlympiadsParticipation,
      olympiadsTrainingSelection: application?.olympiadsTrainingSelection,
      comments: application?.comments,
    };
  };

  return users.map(mapUser).filter(Boolean);
};

export const styleSheet = (sheet) => {
  // team informations style
  for (let i = 2; i <= 3; i++) {
    sheet.getColumn(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: '05FFFE' },
      fgColor: { argb: '05FFFE' },
    };
  }

  // personal informations style
  for (let i = 4; i <= 16; i++) {
    sheet.getColumn(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: 'FFFDDB' },
      fgColor: { argb: 'FFFDDB' },
    };
  }

  // education style
  for (let i = 17; i <= 22; i++) {
    sheet.getColumn(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: 'E4FFDE' },
      fgColor: { argb: 'E4FFDE' },
    };
  }

  // competition style
  for (let i = 23; i <= 27; i++) {
    sheet.getColumn(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: 'F8E3E6' },
      fgColor: { argb: 'F8E3E6' },
    };
  }

  // uploads style
  for (let i = 28; i <= 35; i++) {
    sheet.getColumn(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: 'DAEAF6' },
      fgColor: { argb: 'DAEAF6' },
    };

    sheet.getColumn(i).font = {
      underline: true,
      color: { argb: 'FF0000FF' },
    };
  }

  // header style
  sheet.getRow(1).height = 70;
  sheet.getRow(1).font = {
    size: 11.5,
    bold: true,
    color: { argb: 'FFFFFF' },
  };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    bgColor: { argb: '272163' },
    fgColor: { argb: '272163' },
  };
  sheet.getRow(1).alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
  sheet.getRow(1).border = {
    top: { style: 'thin', color: { argb: 'FFFFFF' } },
    left: { style: 'thin', color: { argb: 'FFFFFF' } },
    bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
    right: { style: 'thin', color: { argb: 'FFFFFF' } },
  };
};

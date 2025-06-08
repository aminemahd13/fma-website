import { User } from 'src/modules/user/entities/user.entity';
import { regionLabels, relationshipWithGuardianLabels } from '../labels';

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
    width: 15,
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
  {
    header: 'Report',
    key: 'report',
    width: 10,
  },
  { header: 'Status', key: 'status', width: 15 },
];

export const rowFactory = (users: any[], configService) => {
  const awsBucketName = configService.get('AWS_BUCKET_NAME');
  const awsBucketRegion = configService.get('AWS_BUCKET_REGION');

  const mapUser = (user: User) => {
    const application = user?.application;
    if (!application) return null;

    return {
      'application-id': application?.id,
      'team-id': 'N/A', // Teams are no longer used
      'team-name': 'Individual', // Teams are no longer used
      'first-name': user?.firstName,
      'last-name': user?.lastName,
      email: user?.email,
      dob: application?.dateOfBirth ? new Date(application?.dateOfBirth) : '',
      'massar-code': application?.massarCode,
      city: application?.city,
      region: regionLabels[application?.region] || application?.region,
      'phone-number': application?.phoneNumber,
      'guardian-full-name': application?.guardianFullName,
      'parent-cnie': application?.parentCNIE,
      'guardian-phone-number': application?.guardianPhoneNumber,
      'relationship-with-guardian':
        relationshipWithGuardianLabels[application?.relationshipWithGuardian] ||
        application?.relationshipWithGuardian,
      'special conditions': application?.specialConditions,

      highschool: application?.highschool,
      'average-grade': application?.averageGrade,
      'physics-average-grade': application?.physicsAverageGrade,
      ranking: application?.ranking,
      'physics-ranking': application?.physicsRanking,
      'has-previously-participated': application?.hasPreviouslyParticipated,
      'previous-competitions': application?.previousCompetitions,
      'physics-olympiads-participation':
        application?.physicsOlympiadsParticipation,
      'olympiads-training-selection': application?.olympiadsTrainingSelection,
      comments: application?.comments,

      'parent-id': application?.parentIdUrl
        ? {
            text: 'View Document',
            hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.parentIdUrl}`,
          }
        : 'Not uploaded',
      'birth-certificate': application?.birthCertificateUrl
        ? {
            text: 'View Document',
            hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.birthCertificateUrl}`,
          }
        : 'Not uploaded',
      'school-certificate': application?.schoolCertificateUrl
        ? {
            text: 'View Document',
            hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.schoolCertificateUrl}`,
          }
        : 'Not uploaded',
      grades: application?.gradesUrl
        ? {
            text: 'View Document',
            hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.gradesUrl}`,
          }
        : 'Not uploaded',
      regulations: application?.regulationsUrl
        ? {
            text: 'View Document',
            hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.regulationsUrl}`,
          }
        : 'Not uploaded',
      'parental-authorization': application?.parentalAuthorizationUrl
        ? {
            text: 'View Document',
            hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.parentalAuthorizationUrl}`,
          }
        : 'Not uploaded',
      'image-rights': application?.imageRightsUrl
        ? {
            text: 'View Document',
            hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.imageRightsUrl}`,
          }
        : 'Not uploaded',
      report: application?.reportUrl
        ? {
            text: 'View Report',
            hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.reportUrl}`,
          }
        : 'Not submitted',

      status: application?.status?.status || 'PENDING',
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

import { User } from 'src/modules/user/entities/user.entity';
import {
  educationFieldLabels,
  educationLevelLabels,
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
  { header: 'CNIE', key: 'cnie', width: 12 },
  { header: 'City', key: 'city', width: 15 },
  { header: 'Region', key: 'region', width: 20 },
  { header: 'Phone number', key: 'phone-number', width: 20 },
  { header: 'Guardian Full Name', key: 'guardian-full-name', width: 25 },
  { header: 'Guardian Phone Number', key: 'guardian-phone-number', width: 25 },
  {
    header: 'Relationship With Guardian',
    key: 'relationship-with-guardian',
    width: 20,
  },
  { header: 'Special conditions', key: 'special conditions', width: 30 },

  { header: 'Education level', key: 'education-level', width: 25 },
  { header: 'Education field', key: 'education-field', width: 25 },
  { header: 'Highschool', key: 'highschool', width: 20 },
  { header: 'Average grade', key: 'average-grade', width: 15 },
  { header: 'Math Average grade', key: 'math-average-grade', width: 15 },
  { header: 'Ranking', key: 'ranking', width: 15 },
  { header: 'Math Ranking', key: 'math-ranking', width: 15 },
  {
    header: 'Number of students in class',
    key: 'number-of-students',
    width: 15,
  },

  {
    header: 'Have you participated in competitions before ?',
    key: 'has-previously-participated',
    width: 15,
  },
  { header: 'Achieved result', key: 'achieved-result', width: 20 },
  {
    header: 'Have you participated in MTYM before ?',
    key: 'has-previously-participated-in-mmc',
    width: 15,
  },
  { header: 'Motivations', key: 'id', width: 30 },
  { header: 'Comments', key: 'id', width: 30 },

  { header: 'CNIE', key: 'cnie', width: 10 },
  { header: 'School certificate', key: 'school-certificate', width: 10 },
  { header: 'Grades', key: 'grades', width: 10 },
  { header: 'Regulations', key: 'regulations', width: 10 },
  {
    header: 'Parental authorization',
    key: 'parental-authorization',
    width: 10,
  },
  { header: 'Status', key: 'status', width: 15 },
];

export const rowFactory = (usersGroupByTeams: any[], configService) => {
  const awsBucketName = configService.get('AWS_BUCKET_NAME');
  const awsBucketRegion = configService.get('AWS_BUCKET_REGION');
  const mapGroup = (group: any[]) => {
    const groupRows = [];
    group.forEach((user: User) => {
      const application = user?.application;
      const team = user?.team;
      if (!application) return;

      const userData = {
        id: application?.id,
        teamId: team?.id,
        teamName: team?.name,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        dateOfBirth: new Date(application?.dateOfBirth),
        identityCardNumber: application?.identityCardNumber,
        city: application?.city,
        region: regionLabels[application?.region],
        phoneNumber: application?.phoneNumber,
        guardianFullName: application?.guardianFullName,
        guardianPhoneNumber: application?.guardianPhoneNumber,
        relationshipWithGuardian:
          relationshipWithGuardianLabels[application?.relationshipWithGuardian],
        specialConditions: application?.specialConditions,

        educationLevel: educationLevelLabels[application?.educationLevel],
        educationField: educationFieldLabels[application?.educationField],
        highschool: application?.highschool,
        averageGrade: application?.averageGrade,
        mathAverageGrade: application?.mathAverageGrade,
        ranking: application?.ranking,
        mathRanking: application?.mathRanking,
        numberOfStudentsInClass: application?.numberOfStudentsInClass,

        hasPreviouslyParticipated: application?.hasPreviouslyParticipated,
        previousCompetitions: application?.previousCompetitions,
        hasPreviouslyParticipatedInMtym:
          application?.hasPreviouslyParticipatedInMtym,
        motivations: application?.motivations,
        comments: application?.comments,

        cnieUrl: {
          text: 'link',
          hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.cnieUrl}`,
        },
        schoolCertificateUrl: {
          text: 'link',
          hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.schoolCertificateUrl}`,
        },
        gradesUrl: {
          text: 'link',
          hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.gradesUrl}`,
        },
        regulationsUrl: {
          text: 'link',
          hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.regulationsUrl}`,
        },
        parentalAuthorizationUrl: {
          text: 'link',
          hyperlink: `https://${awsBucketName}.s3.${awsBucketRegion}.amazonaws.com/${application?.parentalAuthorizationUrl}`,
        },

        status: application?.status?.status,
      };

      groupRows.push(userData);
    });

    groupRows.push({});
    return groupRows;
  };

  const rows = usersGroupByTeams.reduce((prev, current) => {
    const groupRows = mapGroup(current);
    prev.push(...groupRows);
    return prev;
  }, []);

  return rows;
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
  for (let i = 4; i <= 15; i++) {
    sheet.getColumn(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: 'FFFDDB' },
      fgColor: { argb: 'FFFDDB' },
    };
  }

  // education style
  for (let i = 16; i <= 23; i++) {
    sheet.getColumn(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: 'E4FFDE' },
      fgColor: { argb: 'E4FFDE' },
    };
  }

  // competition style
  for (let i = 24; i <= 28; i++) {
    sheet.getColumn(i).fill = {
      type: 'pattern',
      pattern: 'solid',
      bgColor: { argb: 'F8E3E6' },
      fgColor: { argb: 'F8E3E6' },
    };
  }

  // uploads style
  for (let i = 29; i <= 34; i++) {
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

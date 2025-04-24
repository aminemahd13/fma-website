import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitDb1724758379828 implements MigrationInterface {
  name = 'InitDb1724758379828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Original tables from InitDb
    await queryRunner.query(
      `CREATE TABLE \`applications_status\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NOT NULL DEFAULT 'DRAFT', \`parentIdStatus\` varchar(255) NOT NULL DEFAULT 'PENDING', \`birthCertificateStatus\` varchar(255) NOT NULL DEFAULT 'PENDING', \`schoolCertificateStatus\` varchar(255) NOT NULL DEFAULT 'PENDING', \`regulationsStatus\` varchar(255) NOT NULL DEFAULT 'PENDING', \`gradesStatus\` varchar(255) NOT NULL DEFAULT 'PENDING', \`parentalAuthorizationStatus\` varchar(255) NOT NULL DEFAULT 'PENDING', \`imageRightsStatus\` varchar(255) NOT NULL DEFAULT 'PENDING', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`applicationId\` int NULL, UNIQUE INDEX \`REL_de155f8fdccaf125d1e792fd27\` (\`applicationId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`applications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL DEFAULT '', \`lastName\` varchar(255) NOT NULL DEFAULT '', \`dateOfBirth\` timestamp NULL, \`city\` varchar(255) NOT NULL DEFAULT '', \`region\` varchar(255) NOT NULL DEFAULT '', \`phoneNumber\` varchar(255) NOT NULL DEFAULT '', \`guardianFullName\` varchar(255) NOT NULL DEFAULT '', \`guardianPhoneNumber\` varchar(255) NOT NULL DEFAULT '', \`relationshipWithGuardian\` varchar(255) NOT NULL DEFAULT '', \`specialConditions\` text NULL, \`highschool\` varchar(255) NOT NULL DEFAULT '', \`averageGrade\` varchar(255) NOT NULL DEFAULT '', \`ranking\` varchar(255) NOT NULL DEFAULT '', \`hasPreviouslyParticipated\` varchar(255) NOT NULL DEFAULT '', \`previousCompetitions\` text NULL, \`comments\` text NULL, \`schoolCertificateUrl\` varchar(255) NULL, \`gradesUrl\` varchar(255) NULL, \`regulationsUrl\` varchar(255) NULL, \`parentalAuthorizationUrl\` varchar(255) NULL, \`numberOfStudentsInClass\` varchar(255) NOT NULL DEFAULT '', \`massarCode\` varchar(255) NOT NULL DEFAULT '', \`parentCNIE\` varchar(255) NOT NULL DEFAULT '', \`physicsAverageGrade\` varchar(255) NOT NULL DEFAULT '', \`physicsRanking\` varchar(255) NOT NULL DEFAULT '', \`physicsOlympiadsParticipation\` varchar(255) NOT NULL DEFAULT '', \`olympiadsTrainingSelection\` varchar(255) NOT NULL DEFAULT '', \`parentIdUrl\` varchar(255) NULL, \`birthCertificateUrl\` varchar(255) NULL, \`imageRightsUrl\` varchar(255) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`statusId\` int NULL, UNIQUE INDEX \`REL_90ad8bec24861de0180f638b9c\` (\`userId\`), UNIQUE INDEX \`REL_2ccfa45ebf6c44b5f26a1a87ff\` (\`statusId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`identifier\` varchar(255) NOT NULL DEFAULT '', \`firstName\` varchar(255) NOT NULL DEFAULT '', \`lastName\` varchar(255) NOT NULL DEFAULT '', \`email\` varchar(255) NOT NULL DEFAULT '', \`password\` varchar(255) NOT NULL DEFAULT '', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`applicationId\` int NULL, UNIQUE INDEX \`REL_315a6ad486c15783fb06517691\` (\`applicationId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`admin_users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL DEFAULT '', \`password\` varchar(255) NOT NULL DEFAULT '', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    // Create settings table from CreateSettingsTable migration
    await queryRunner.query(`
      CREATE TABLE \`settings\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`key\` varchar(255) NOT NULL,
        \`value\` varchar(255) NOT NULL,
        \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_settings_key\` (\`key\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Add default settings
    await queryRunner.query(`
      INSERT INTO \`settings\` (\`key\`, \`value\`) VALUES ('APPLICATIONS_OPEN', 'false')
    `);

    // Create FAQ table from CreateFaqTable migration
    await queryRunner.createTable(
      new Table({
        name: 'faq',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'question',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'answer',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'order',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
      true
    );

    // Create competition_results table from CreateCompetitionResultsTable migration
    await queryRunner.createTable(
      new Table({
        name: 'competition_results',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'rank',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'school',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'score',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'medal',
            type: 'enum',
            enum: ['gold', 'silver', 'bronze', 'honorable_mention', 'none'],
            default: "'none'",
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
      true
    );

    // Create team_members table from CreateTeamMembersTable migration
    await queryRunner.createTable(
      new Table({
        name: 'team_members',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'imageSrc',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'linkedinSrc',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'portfolioSrc',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'varchar',
            isNullable: false,
            comment: 'organizingCommittee, staff, webDevelopment, brandDesign, um6p',
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'order',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
      true
    );
    
    // Add foreign key constraints
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` ADD CONSTRAINT \`FK_de155f8fdccaf125d1e792fd277\` FOREIGN KEY (\`applicationId\`) REFERENCES \`applications\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_90ad8bec24861de0180f638b9cc\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_2ccfa45ebf6c44b5f26a1a87ffe\` FOREIGN KEY (\`statusId\`) REFERENCES \`applications_status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_315a6ad486c15783fb065176918\` FOREIGN KEY (\`applicationId\`) REFERENCES \`applications\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_315a6ad486c15783fb065176918\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_2ccfa45ebf6c44b5f26a1a87ffe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_90ad8bec24861de0180f638b9cc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` DROP FOREIGN KEY \`FK_de155f8fdccaf125d1e792fd277\``,
    );
    
    // Drop all tables in reverse order
    await queryRunner.dropTable('team_members');
    await queryRunner.dropTable('competition_results');
    await queryRunner.dropTable('faq');
    await queryRunner.query(`DROP TABLE \`settings\``);
    await queryRunner.query(`DROP TABLE \`admin_users\``);
    await queryRunner.query(
      `DROP INDEX \`REL_315a6ad486c15783fb06517691\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`REL_2ccfa45ebf6c44b5f26a1a87ff\` ON \`applications\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_90ad8bec24861de0180f638b9c\` ON \`applications\``,
    );
    await queryRunner.query(`DROP TABLE \`applications\``);
    await queryRunner.query(
      `DROP INDEX \`REL_de155f8fdccaf125d1e792fd27\` ON \`applications_status\``,
    );
    await queryRunner.query(`DROP TABLE \`applications_status\``);
  }
}

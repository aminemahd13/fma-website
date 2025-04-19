import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParentalAuthorizationStatus1726011795618
  implements MigrationInterface
{
  name = 'AddParentalAuthorizationStatus1726011795618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` ADD \`parentalAuthorizationStatus\` varchar(255) NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` CHANGE \`cnieStatus\` \`cnieStatus\` varchar(255) NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` CHANGE \`schoolCertificateStatus\` \`schoolCertificateStatus\` varchar(255) NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` CHANGE \`regulationsStatus\` \`regulationsStatus\` varchar(255) NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` CHANGE \`gradesStatus\` \`gradesStatus\` varchar(255) NOT NULL DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` CHANGE \`gradesStatus\` \`gradesStatus\` varchar(255) NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` CHANGE \`regulationsStatus\` \`regulationsStatus\` varchar(255) NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` CHANGE \`schoolCertificateStatus\` \`schoolCertificateStatus\` varchar(255) NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` CHANGE \`cnieStatus\` \`cnieStatus\` varchar(255) NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` DROP COLUMN \`parentalAuthorizationStatus\``,
    );
  }
}

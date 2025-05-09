import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReportColumns1725005123456 implements MigrationInterface {
  name = 'AddReportColumns1725005123456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add reportUrl column to applications table
    await queryRunner.query(
      `ALTER TABLE \`applications\` ADD \`reportUrl\` varchar(255) NULL`,
    );

    // Add reportStatus column to applications_status table
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` ADD \`reportStatus\` varchar(255) NOT NULL DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the columns if rollback is needed
    await queryRunner.query(
      `ALTER TABLE \`applications_status\` DROP COLUMN \`reportStatus\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`applications\` DROP COLUMN \`reportUrl\``,
    );
  }
}
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeApplicationEntity1725403860698
  implements MigrationInterface
{
  name = 'ChangeApplicationEntity1725403860698';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`applications\` ADD \`numberOfStudentsInClass\` varchar(255) NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`applications\` DROP COLUMN \`numberOfStudentsInClass\``,
    );
  }
}

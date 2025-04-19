import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingsTable1726000000000 implements MigrationInterface {
  name = 'CreateSettingsTable1726000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`settings\``);
  }
} 
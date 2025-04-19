import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeamAccessCodeTable1724779361631
  implements MigrationInterface
{
  name = 'CreateTeamAccessCodeTable1724779361631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`teams-access-code\` (\`id\` int NOT NULL AUTO_INCREMENT, \`accessCode\` varchar(255) NOT NULL DEFAULT '', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`teamId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`teams-access-code\` ADD CONSTRAINT \`FK_3d60c40a9dd17f35ba31cf30fa9\` FOREIGN KEY (\`teamId\`) REFERENCES \`teams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`teams-access-code\` DROP FOREIGN KEY \`FK_3d60c40a9dd17f35ba31cf30fa9\``,
    );
    await queryRunner.query(`DROP TABLE \`teams-access-code\``);
  }
}

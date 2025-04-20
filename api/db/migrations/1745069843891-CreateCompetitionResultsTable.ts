import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCompetitionResultsTable1745069843891 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('competition_results');
    }
} 
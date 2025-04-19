import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTeamMembersTable1745069843891 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('team_members');
    }
}
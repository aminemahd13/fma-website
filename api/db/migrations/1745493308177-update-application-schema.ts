import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateApplicationSchema1745493308177 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new fields to applications table
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`massarCode\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`parentCNIE\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`physicsAverageGrade\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`physicsRanking\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`physicsOlympiadsParticipation\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`olympiadsTrainingSelection\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`parentIdUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`birthCertificateUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`imageRightsUrl\` varchar(255) NULL`);

        // Add new fields to applications_status table
        await queryRunner.query(`ALTER TABLE \`applications_status\` ADD \`parentIdStatus\` varchar(255) NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`applications_status\` ADD \`birthCertificateStatus\` varchar(255) NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`applications_status\` ADD \`imageRightsStatus\` varchar(255) NOT NULL DEFAULT 'PENDING'`);

        // Remove obsolete fields from applications table
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`identityCardNumber\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`educationLevel\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`educationField\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`mathAverageGrade\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`mathRanking\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`hasPreviouslyParticipatedInMtym\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`motivations\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`cnieUrl\``);

        // Remove obsolete fields from applications_status table
        await queryRunner.query(`ALTER TABLE \`applications_status\` DROP COLUMN \`cnieStatus\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Restore obsolete fields to applications_status table
        await queryRunner.query(`ALTER TABLE \`applications_status\` ADD \`cnieStatus\` varchar(255) NOT NULL DEFAULT 'PENDING'`);

        // Restore obsolete fields to applications table
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`cnieUrl\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`motivations\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`hasPreviouslyParticipatedInMtym\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`mathRanking\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`mathAverageGrade\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`educationField\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`educationLevel\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`identityCardNumber\` varchar(255) NOT NULL DEFAULT ''`);

        // Remove new fields from applications_status table
        await queryRunner.query(`ALTER TABLE \`applications_status\` DROP COLUMN \`imageRightsStatus\``);
        await queryRunner.query(`ALTER TABLE \`applications_status\` DROP COLUMN \`birthCertificateStatus\``);
        await queryRunner.query(`ALTER TABLE \`applications_status\` DROP COLUMN \`parentIdStatus\``);

        // Remove new fields from applications table
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`imageRightsUrl\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`birthCertificateUrl\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`parentIdUrl\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`olympiadsTrainingSelection\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`physicsOlympiadsParticipation\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`physicsRanking\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`physicsAverageGrade\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`parentCNIE\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`massarCode\``);
    }
}

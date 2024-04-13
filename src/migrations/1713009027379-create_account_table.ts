import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountTable1713009027379 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
CREATE TABLE public."account" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    "provider_username" character varying NOT NULL,
    "provider" character varying NOT NULL,
    "provider_id" character varying NOT NULL,
    "username" character varying,
    "email" character varying,
    "gender" character varying,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamptz DEFAULT CURRENT_TIMESTAMP
)
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public."account"`);
    }
}

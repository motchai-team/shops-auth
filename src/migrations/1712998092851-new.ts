import { MigrationInterface, QueryRunner } from 'typeorm';

export class New1712998092851 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public.Account RENAME "gender" TO "sex";`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public.Account RENAME "sex" TO "gender";`);
    }
}

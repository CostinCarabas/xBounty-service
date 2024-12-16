import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1681551466658 implements MigrationInterface {
    name = 'InitialSetup1681551466658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`address\` varchar(62) NOT NULL, \`creationDate\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_b0ec0293d53a1385955f9834d5\` (\`address\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b0ec0293d53a1385955f9834d5\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}

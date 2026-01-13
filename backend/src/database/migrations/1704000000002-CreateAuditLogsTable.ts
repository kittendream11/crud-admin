import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAuditLogsTable1704000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'action',
            type: 'enum',
            enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'],
          },
          {
            name: 'entity',
            type: 'varchar',
          },
          {
            name: 'entityId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'changes',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'audit_logs',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('audit_logs');
  }
}

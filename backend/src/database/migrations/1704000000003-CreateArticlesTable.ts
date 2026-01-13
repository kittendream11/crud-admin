import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateArticlesTable1704000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'articles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'featuredImage',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['draft', 'published', 'archived'],
            default: "'draft'",
          },
          {
            name: 'tags',
            type: 'text',
            array: true,
            default: 'ARRAY[]',
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'authorId',
            type: 'varchar',
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
          },
          {
            name: 'publishedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('articles');
  }
}

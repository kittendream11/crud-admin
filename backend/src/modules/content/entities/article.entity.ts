import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  featuredImage?: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  status: 'draft' | 'published' | 'archived';

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]' })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column()
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  publishedAt?: Date;
}

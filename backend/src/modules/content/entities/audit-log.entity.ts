import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column()
  entity: string;

  @Column({ nullable: true })
  entityId?: string;

  @Column({ type: 'jsonb', nullable: true })
  changes?: Record<string, any>;

  @ManyToOne(() => User, (user) => user.auditLogs, { onDelete: 'SET NULL' })
  user?: User;

  @Column('uuid', { nullable: true })
  userId?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt: Date;
}

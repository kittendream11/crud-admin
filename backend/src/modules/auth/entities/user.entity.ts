import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { RefreshToken } from './refresh-token.entity';
import { AuditLog } from '../content/entities/audit-log.entity';

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  VIEWER = 'viewer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ nullable: true })
  lastPasswordChange?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RefreshToken, (token) => token.user, { cascade: true })
  refreshTokens: RefreshToken[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

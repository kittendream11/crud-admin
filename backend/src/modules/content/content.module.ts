import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Category } from './entities/category.entity';
import { AuditLog } from './entities/audit-log.entity';
import { ContentService } from './services/content.service';
import { ContentController } from './controllers/content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category, AuditLog])],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}

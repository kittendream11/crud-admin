import { IsString, IsOptional, IsEnum, IsArray, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'My First Article' })
  @IsString()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'my-first-article' })
  @IsString()
  @MinLength(5)
  slug: string;

  @ApiProperty({ example: 'Article content...' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiProperty({ enum: ['draft', 'published', 'archived'], required: false })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateArticleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(5)
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiProperty({ enum: ['draft', 'published', 'archived'], required: false })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  slug: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  isActive?: boolean;
}

export class UpdateCategoryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  isActive?: boolean;
}

export class ContentQueryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @ApiProperty({ required: false, enum: ['draft', 'published', 'archived'] })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';
}

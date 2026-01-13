import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContentService } from '../services/content.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import {
  CreateArticleDto,
  UpdateArticleDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  ContentQueryDto,
} from '../dto/content.dto';

@ApiTags('Content')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
@Controller({
  path: 'content',
  version: '1',
})
export class ContentController {
  constructor(private contentService: ContentService) {}

  // ========== ARTICLES ==========

  @Post('articles')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({
    status: 201,
    description: 'Article created successfully',
  })
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Req() req: any,
  ) {
    return this.contentService.createArticle(createArticleDto, req.user.id);
  }

  @Get('articles')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({
    status: 200,
    description: 'Articles retrieved successfully',
  })
  async getAllArticles(@Query() query: ContentQueryDto) {
    return this.contentService.getAllArticles(query);
  }

  @Get('articles/:id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiResponse({
    status: 200,
    description: 'Article found',
  })
  @ApiResponse({
    status: 404,
    description: 'Article not found',
  })
  async getArticleById(@Param('id') id: string) {
    return this.contentService.getArticleById(id);
  }

  @Put('articles/:id')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({
    status: 200,
    description: 'Article updated successfully',
  })
  async updateArticle(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: any,
  ) {
    return this.contentService.updateArticle(id, updateArticleDto, req.user.id);
  }

  @Delete('articles/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({
    status: 204,
    description: 'Article deleted successfully',
  })
  async deleteArticle(@Param('id') id: string, @Req() req: any) {
    await this.contentService.deleteArticle(id, req.user.id);
  }

  @Put('articles/:id/publish')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Publish article' })
  @ApiResponse({
    status: 200,
    description: 'Article published successfully',
  })
  async publishArticle(@Param('id') id: string, @Req() req: any) {
    return this.contentService.publishArticle(id, req.user.id);
  }

  @Put('articles/:id/archive')
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Archive article' })
  @ApiResponse({
    status: 200,
    description: 'Article archived successfully',
  })
  async archiveArticle(@Param('id') id: string, @Req() req: any) {
    return this.contentService.archiveArticle(id, req.user.id);
  }

  // ========== CATEGORIES ==========

  @Post('categories')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
  })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.contentService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async getAllCategories(@Query() query: ContentQueryDto) {
    return this.contentService.getAllCategories(query);
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category found',
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  async getCategoryById(@Param('id') id: string) {
    return this.contentService.getCategoryById(id);
  }

  @Put('categories/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
  })
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.contentService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({
    status: 204,
    description: 'Category deleted successfully',
  })
  async deleteCategory(@Param('id') id: string) {
    await this.contentService.deleteCategory(id);
  }

  // ========== AUDIT LOGS ==========

  @Get('audit-logs')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiResponse({
    status: 200,
    description: 'Audit logs retrieved successfully',
  })
  async getAuditLogs(@Query() query: ContentQueryDto) {
    return this.contentService.getAuditLogs(query);
  }
}

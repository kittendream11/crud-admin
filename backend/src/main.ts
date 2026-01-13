import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { createLoggerInstance } from './common/logging/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const logger = createLoggerInstance(configService);
  app.useLogger(logger);

  // CORS Configuration
  const corsOrigin = configService.get('CORS_ORIGIN');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
  });

  // Swagger/OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Admin CRUD API')
    .setDescription('Comprehensive admin CRUD system API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Token',
      },
      'access-token',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Content', 'Content management endpoints')
    .addTag('Health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get('APP_PORT') || 3000;
  const appName = configService.get('APP_NAME');

  await app.listen(port, '0.0.0.0', () => {
    logger.info(`${appName} is running on http://localhost:${port}`);
    logger.info(`Swagger docs available at http://localhost:${port}/api/docs`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});

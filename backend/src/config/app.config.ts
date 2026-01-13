import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'crud-admin-api',
  port: parseInt(process.env.APP_PORT || '3000'),
  url: process.env.APP_URL || 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  uploadDir: process.env.UPLOAD_DESTINATION || './uploads',
  logLevel: process.env.LOG_LEVEL || 'debug',
  logDir: process.env.LOG_DIR || './logs',
}));

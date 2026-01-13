import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  APP_NAME: Joi.string().default('crud-admin-api'),
  APP_PORT: Joi.number().default(3000),
  APP_URL: Joi.string().default('http://localhost:3000'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

  BCRYPT_ROUNDS: Joi.number().default(10),
  MAX_FILE_SIZE: Joi.number().default(5242880),
  UPLOAD_DESTINATION: Joi.string().default('./uploads'),

  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'debug').default('debug'),
  LOG_DIR: Joi.string().default('./logs'),

  CORS_ORIGIN: Joi.string().default('http://localhost:3001'),
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),
});

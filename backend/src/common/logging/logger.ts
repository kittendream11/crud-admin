import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

export function createLoggerInstance(configService: ConfigService) {
  const logDir = configService.get('LOG_DIR') || './logs';
  const logLevel = configService.get('LOG_LEVEL') || 'debug';
  const isProduction = configService.get('NODE_ENV') === 'production';

  const baseTransports = [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize(),
        format.printf(({ timestamp, level, message, context, requestId }) => {
          const contextStr = context ? ` [${context}]` : '';
          const requestIdStr = requestId ? ` [${requestId}]` : '';
          return `${timestamp} [${level}]${contextStr}${requestIdStr} ${message}`;
        }),
      ),
    }),
  ];

  if (isProduction) {
    baseTransports.push(
      new DailyRotateFile({
        filename: path.join(logDir, 'application-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxDays: '14d',
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.json(),
        ),
      }),
      new DailyRotateFile({
        filename: path.join(logDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxDays: '14d',
        level: 'error',
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.json(),
        ),
      }),
    );
  }

  return createLogger({
    level: logLevel,
    transports: baseTransports,
  });
}

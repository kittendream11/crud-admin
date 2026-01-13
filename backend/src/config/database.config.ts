import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  getTypeormConfig(): TypeOrmModuleOptions {
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_DATABASE'),
      entities: [path.join(__dirname, '../modules/**/*.entity{.ts,.js}')],
      migrations: [path.join(__dirname, '../database/migrations/*{.ts,.js}')],
      migrationsRun: false,
      synchronize: !isProduction,
      logging: !isProduction,
      ssl: isProduction
        ? {
            rejectUnauthorized: false,
          }
        : false,
    };
  }
}

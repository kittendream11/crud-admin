import { Injectable, BadRequestException } from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationService {
  async validate<T>(cls: new () => T, plain: object): Promise<T> {
    const object = plainToClass(cls, plain);
    const errors = await validate(object, {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = this.formatErrors(errors);
      throw new BadRequestException(messages.join(', '));
    }

    return object;
  }

  private formatErrors(errors: ValidationError[]): string[] {
    return errors.flatMap((error) => {
      if (error.constraints) {
        return Object.values(error.constraints);
      }

      if (error.children && error.children.length > 0) {
        return this.formatErrors(error.children);
      }

      return [];
    });
  }
}

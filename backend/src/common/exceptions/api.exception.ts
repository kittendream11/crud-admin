import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    private readonly errorCode?: string,
  ) {
    super(
      {
        statusCode,
        message,
        errorCode,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

export class BadRequestException extends ApiException {
  constructor(message: string, errorCode?: string) {
    super(message, HttpStatus.BAD_REQUEST, errorCode);
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message = 'Unauthorized', errorCode?: string) {
    super(message, HttpStatus.UNAUTHORIZED, errorCode);
  }
}

export class ForbiddenException extends ApiException {
  constructor(message = 'Forbidden', errorCode?: string) {
    super(message, HttpStatus.FORBIDDEN, errorCode);
  }
}

export class NotFoundException extends ApiException {
  constructor(message = 'Not Found', errorCode?: string) {
    super(message, HttpStatus.NOT_FOUND, errorCode);
  }
}

export class ConflictException extends ApiException {
  constructor(message = 'Conflict', errorCode?: string) {
    super(message, HttpStatus.CONFLICT, errorCode);
  }
}

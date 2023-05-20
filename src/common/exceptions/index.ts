import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiExceptionType } from '../types';

export class ApiException extends HttpException {
  constructor(exception: ApiExceptionType) {
    if (!exception.message) {
      // If no message is provided, set default message based on status
      for (const key in HttpStatus) {
        if (HttpStatus[key as keyof HttpStatus] === exception.status) {
          exception.message = key;
        }
      }
    }
    super({ succes: false, message: exception.message }, exception.status);
  }
}

export class ApiExceptionBuilder {
  private exception: ApiExceptionType;
  constructor(status: HttpStatus) {
    this.exception = {
      status,
      message: null,
    };
  }
  message(message: string): ApiExceptionBuilder {
    this.exception.message = message;
    return this;
  }
  build(): ApiException {
    return new ApiException(this.exception);
  }
}

// Custom exceptions
export class FileNotFoundException extends ApiException {
  constructor() {
    super({
      status: HttpStatus.NOT_FOUND,
      message: 'File Not Found',
    });
  }
}

export class InternalServerErrorException extends ApiException {
  constructor(message?: string) {
    super({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
    });
  }
}

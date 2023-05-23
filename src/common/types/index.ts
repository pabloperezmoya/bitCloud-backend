import { HttpStatus } from '@nestjs/common';

export type JwtPayload = {
  user: {
    sub: string;
  };
};

export type ApiExceptionType = {
  message?: string;
  status?: HttpStatus;
};

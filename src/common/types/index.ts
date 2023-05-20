import { HttpStatus } from '@nestjs/common';

export type JwtPayload = {
  user: {
    email: string;
    sub: string;
  };
};

export type ApiExceptionType = {
  message?: string;
  status?: HttpStatus;
};

import { Type } from '@nestjs/common';

export type ApiDocsData = {
  operationSummary?: string;
  operationDescription?: string;

  responseStatus?: number;
  responseDescription?: string;
  responseType?: any;

  bodyDescription?: string;
  bodyType?: any;

  consume?: string;

  queryParameters?: QueryParams[];
};

export type QueryParams = {
  name: string;
  description?: string;
  required?: boolean;
};

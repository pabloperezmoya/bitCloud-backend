import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiDocsData, QueryParams } from './apidocs.types';

const defaultApiDocsData: ApiDocsData = {
  operationSummary: 'Default summary for API operation',
  operationDescription: 'Default description for API operation',

  responseStatus: HttpStatus.OK,
  responseDescription: 'Default description for API response',
  responseType: undefined,

  bodyDescription: 'None',
  bodyType: undefined,
  consume: 'application/json',

  queryParameters: [],
};

export class ApiDocsBuilder {
  operationData: ApiDocsData;

  constructor() {
    this.operationData = {};
  }

  operationsummary(summary: string): ApiDocsBuilder {
    this.operationData.operationSummary =
      summary || defaultApiDocsData.operationSummary;
    return this;
  }

  operationDescription(description: string): ApiDocsBuilder {
    this.operationData.operationDescription =
      description || defaultApiDocsData.operationDescription;
    return this;
  }

  responseStatus(status: HttpStatus): ApiDocsBuilder {
    this.operationData.responseStatus =
      status || defaultApiDocsData.responseStatus;
    return this;
  }

  responseDescription(description: string): ApiDocsBuilder {
    this.operationData.responseDescription =
      description || defaultApiDocsData.responseDescription;
    return this;
  }

  responseType(type: any | any[]): ApiDocsBuilder {
    this.operationData.responseType = type || defaultApiDocsData.responseType;
    return this;
  }

  bodyDescription(bodyDescription: string): ApiDocsBuilder {
    this.operationData.bodyDescription =
      bodyDescription || defaultApiDocsData.bodyDescription;
    return this;
  }

  bodyType(bodyType: string): ApiDocsBuilder {
    this.operationData.bodyType = bodyType || defaultApiDocsData.bodyType;
    return this;
  }

  queryParameters(queryParameters: QueryParams[]): ApiDocsBuilder {
    this.operationData.queryParameters = queryParameters;
    return this;
  }

  consume(consume: string): ApiDocsBuilder {
    this.operationData.consume = consume || defaultApiDocsData.consume;
    return this;
  }

  build(): MethodDecorator {
    const {
      operationSummary,
      operationDescription,

      responseStatus,
      responseDescription,
      responseType,

      bodyDescription,
      bodyType,

      consume,

      queryParameters,
    } = this.operationData;

    const decorators = [];

    decorators.push(
      ApiOperation({
        summary: operationSummary,
        description: operationDescription,
      }),
      ApiResponse({
        status: responseStatus,
        description: responseDescription,
        type: responseType,
      }),
      ApiConsumes(consume),
    );

    if (queryParameters?.length > 0) {
      decorators.push(
        ...queryParameters.map((param) => {
          return ApiQuery({
            ...param,
          });
        }),
      );
    }

    if (bodyType && bodyDescription) {
      decorators.push(
        ApiBody({
          description: bodyDescription,
          type: bodyType,
        }),
      );
    }

    return applyDecorators(...decorators);
  }
}

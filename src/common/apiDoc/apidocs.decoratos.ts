import { ApiDocsBuilder } from './apidocs.builder';
import { ApiDocsData } from './apidocs.types';

export function ApiDocs(data?: ApiDocsData): MethodDecorator {
  const builder = new ApiDocsBuilder();

  return builder
    .operationsummary(data?.operationSummary)
    .operationDescription(data?.operationDescription)

    .responseStatus(data?.responseStatus)
    .responseDescription(data?.responseDescription)
    .responseType(data?.responseType)

    .bodyDescription(data?.bodyDescription)
    .bodyType(data?.bodyType)

    .queryParameters(data?.queryParameters)

    .consume(data?.consume)

    .build();
}

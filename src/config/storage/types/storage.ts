import { S3Client } from '@aws-sdk/client-s3';

export type Storage = {
  S3: S3Client;
  bucketName: string;
};

import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../config';

import { S3Client } from '@aws-sdk/client-s3';
//@Global()
@Module({
  providers: [
    {
      provide: 'STORAGE',
      useFactory: (configService: ConfigType<typeof config>) => {
        const {
          bucketName,
          endpointProvider,
          accountId,
          accessKeyId,
          secretAccessKey,
          bucketRegion,
        } = configService.storage;

        const S3 = new S3Client({
          region: bucketRegion,
          endpoint: `https://${accountId}.${endpointProvider}`,
          credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
          },
        });
        return {
          S3,
          bucketName,
        };
      },
      inject: [config.KEY],
    },
  ],
  exports: ['STORAGE'],
})
export class StorageModule {}

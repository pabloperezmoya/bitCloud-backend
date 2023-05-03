import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [DatabaseModule, StorageModule],

  exports: [DatabaseModule, StorageModule],
})
export class ConfigModule {}

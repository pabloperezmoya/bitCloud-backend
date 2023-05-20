import { Module } from '@nestjs/common';
import { StorageController } from './controllers/storage.controller';
import { StorageService } from './services/storage.service';
import { StorageModule as configStorageModule } from '../config/storage/storage.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageFile, StorageFileSchema } from './entities/storage.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StorageFile.name,
        schema: StorageFileSchema,
      },
    ]),
    configStorageModule,
  ],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}

// TODO
// On the storage.service.ts implement the following methods:
// - Inject('STORAGE') private storage: Storage, // Injecting the storage service
// - Create storage entity:
//    - InjectModel(Storage.name) private storageModel: Model<Storage>, // Injecting the storage model

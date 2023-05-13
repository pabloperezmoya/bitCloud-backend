import { Module } from '@nestjs/common';
import { StorageController } from './controllers/storage.controller';
import { StorageService } from './services/storage.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}

// TODO
// On the storage.service.ts implement the following methods:
// - Inject('STORAGE') private storage: Storage, // Injecting the storage service
// - Create storage entity:
//    - InjectModel(Storage.name) private storageModel: Model<Storage>, // Injecting the storage model

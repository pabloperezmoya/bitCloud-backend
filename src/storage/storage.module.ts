import { Module } from '@nestjs/common';
import { StorageController } from './controllers/storage.controller';
import { StorageService } from './services/storage.service';
import { StorageModule as configStorageModule } from '../config/storage/storage.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageFile, StorageFileSchema } from './entities/storage.entity';
import { FoldersService } from '../folders/services/folders.service';
import { Folder, FolderSchema } from '../folders/entities/folder.entity';
import { UsersService } from '../users/services/users.service';
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StorageFile.name,
        schema: StorageFileSchema,
      },
      {
        name: Folder.name,
        schema: FolderSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    configStorageModule,
  ],
  controllers: [StorageController],
  providers: [StorageService, FoldersService, UsersService],
})
export class StorageModule {}

import { Module, forwardRef } from '@nestjs/common';
import { FoldersService } from './services/folders.service';
import { FoldersController } from './controllers/folders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from './entities/folder.entity';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';
import { ClerkAuthModule } from '../clerkAuth/clerk-auth.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Folder.name,
        schema: FolderSchema,
      },
    ]),
  ],
  providers: [FoldersService],
  controllers: [FoldersController],
})
export class FoldersModule {}

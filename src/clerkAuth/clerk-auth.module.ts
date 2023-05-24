import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ClerkAuthController } from './controllers/clerk-auth.controller';
import { ClerkAuthService } from './services/clerk-auth.service';
import config from '../config/config';
import { FoldersService } from '../folders/services/folders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from '../folders/entities/folder.entity';

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
  controllers: [ClerkAuthController],
  providers: [
    {
      provide: 'CLERK_WEBHOOK_SECRET',
      useFactory: () => config().clerk.clerkWebhookSignInSecret,
    },
    ClerkAuthService,
    FoldersService,
  ],
})
export class ClerkAuthModule {}

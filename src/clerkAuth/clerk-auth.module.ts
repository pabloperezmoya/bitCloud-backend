import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ClerkAuthController } from './controllers/clerk-auth.controller';
import { ClerkAuthService } from './services/clerk-auth.service';
import config from '../config/config';

@Module({
  imports: [UsersModule],
  controllers: [ClerkAuthController],
  providers: [
    {
      provide: 'CLERK_WEBHOOK_SECRET',
      useFactory: () => config().clerk.clerkWebhookSignInSecret,
    },
    ClerkAuthService,
  ],
})
export class ClerkAuthModule {}

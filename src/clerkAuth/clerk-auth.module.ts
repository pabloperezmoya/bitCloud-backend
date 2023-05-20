import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { ClerkAuthController } from './controllers/clerk-auth.controller';
import { ClerkAuthService } from './services/clerk-auth.service';

@Module({
  imports: [UsersModule],
  controllers: [ClerkAuthController],
  providers: [ClerkAuthService],
})
export class ClerkAuthModule {}

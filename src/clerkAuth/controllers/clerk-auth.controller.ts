import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { ClerkPayload, EventType } from '../dto/clerk-auth.dto';
import { ClerkAuthService } from '../services/clerk-auth.service';

import { WebhookGuard } from '../guards/webhook.guard';
import { AuthMethods } from '../../users/entities/user.entity';

import * as bcrypt from 'bcrypt';

@Controller('webhooks/clerk')
export class ClerkAuthController {
  constructor(private clerkAuthService: ClerkAuthService) {}

  @Public()
  @UseGuards(WebhookGuard)
  @Post()
  async handleWebhook(
    @Body() payload: ClerkPayload,
    @Body('type') type: EventType,
  ) {
    switch (type) {
      case EventType.USER_CREATED:
        return this.onCreateUser(payload);
      case EventType.USER_UPDATED:
        return this.onUpdateUser(payload);
      default:
        return;
    }
  }

  private async onCreateUser(@Body() payload: ClerkPayload) {
    const parcialPayload = await this.clerkAuthService.getDataFromPayload(
      payload,
    );
    const createdAt = payload.data.created_at;

    const genericPasswd = await bcrypt.hash(
      createdAt.toString() + parcialPayload.name + parcialPayload.email,
      10,
    );

    const userPayload = {
      ...parcialPayload,
      password: genericPasswd,
      authMethod: AuthMethods.CLERK,
      createdAt,
    };
    return this.clerkAuthService.createUser(userPayload);
  }

  private async onUpdateUser(@Body() payload: ClerkPayload) {
    const parcialPayload = await this.clerkAuthService.getDataFromPayload(
      payload,
    );
    const updatedAt = payload.data.updated_at;

    const userUpdatePayload = {
      ...parcialPayload,
      updatedAt,
    };

    return this.clerkAuthService.updateUser(userUpdatePayload);
  }
}

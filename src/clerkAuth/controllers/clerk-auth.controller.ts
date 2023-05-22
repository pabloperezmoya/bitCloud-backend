import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
import { ClerkPayload } from '../dto/clerk-auth.dto';
import { ClerkAuthService } from '../services/clerk-auth.service';

import { WebhookGuard } from '../guards/webhook.guard';
import { AuthMethods } from '../../users/entities/user.entity';

import * as bcrypt from 'bcrypt';

@Controller('clerk-auth-webhook')
export class ClerkAuthController {
  constructor(private clerkAuthService: ClerkAuthService) {}

  @Public()
  @UseGuards(WebhookGuard)
  @Post('oncreateuser')
  async onCreateUser(@Body() payload: ClerkPayload) {
    const username = payload.data.username;
    const primary_email_address_id = payload.data.primary_email_address_id;
    const email = payload.data.email_addresses.find(
      (email) => email.id === primary_email_address_id,
    ).email_address;

    const id = payload.data.id;
    const createdAt = payload.data.created_at;

    const genericPasswd = await bcrypt.hash(
      createdAt.toString() + username + email,
      10,
    );

    const userPayload = {
      userId: id,
      name: username,
      email,
      password: genericPasswd,
      authMethod: AuthMethods.CLERK,
      createdAt,
    };
    return this.clerkAuthService.createUser(userPayload);
  }

  @Public()
  @Post('onuserupdate')
  async onUpdateUser(@Body() payload: any) {
    // const user = clerk.users.getUserList();
    // return user;
    // Use user service to update users
    console.log(payload);
  }

  // TODO: On user delete
}

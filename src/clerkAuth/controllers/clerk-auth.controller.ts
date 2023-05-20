import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Public } from '@auth/decorators/public.decorator';
import { ClerkPayload } from '../dto/clerk-auth.dto';
import { ClerkAuthService } from '../services/clerk-auth.service';
import { Request } from 'express';

@Controller('clerk-auth-webhook')
export class ClerkAuthController {
  constructor(private clerkAuthService: ClerkAuthService) {}

  @Public()
  @Post('oncreateuser')
  async onCreateUser(@Body() payload: ClerkPayload, @Req() req: Request) {
    // Recieve webhook from Clerk
    // Create user in database
    // use UserService
    console.log(req.headers);
    return req.headers;
    // const username = payload.data.username;
    // const primary_email_address_id = payload.data.primary_email_address_id;
    // const email = payload.data.email_addresses.find(
    //   (email) => email.id === primary_email_address_id,
    // ).email_address;

    // const id = payload.data.id;
    // const createdAt = payload.data.created_at;

    // const userPayload = {
    //   id,
    //   name: username,
    //   password: 'clerk',
    //   email,
    //   createdAt,
    // };
    // return this.clerkAuthService.createUser(userPayload);
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

import { Injectable } from '@nestjs/common';

import { CreateUserDTO } from '@users/dto/user.dto';
import { UsersService } from '@users/services/users.service';

import clerk from '@clerk/clerk-sdk-node';
import 'dotenv/config';

@Injectable()
export class ClerkAuthService {
  constructor(private usersService: UsersService) {}

  async createUser(payload: CreateUserDTO) {
    // verify webhook

    // create user in database
    return this.usersService.createUser(payload);
  }
}

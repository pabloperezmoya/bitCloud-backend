import { Injectable } from '@nestjs/common';

import { CreateUserDTO, UpdateUserDTO } from '../../users/dto/user.dto';
import { UsersService } from '../../users/services/users.service';

import { ClerkPayload, ParcialPayload } from '../dto/clerk-auth.dto';

@Injectable()
export class ClerkAuthService {
  constructor(private usersService: UsersService) {}

  async getDataFromPayload(payload: ClerkPayload): Promise<ParcialPayload> {
    const username = payload.data.username;
    const primary_email_address_id = payload.data.primary_email_address_id;
    const email = payload.data.email_addresses.find(
      (email) => email.id === primary_email_address_id,
    ).email_address;

    const id = payload.data.id;

    return {
      userId: id,
      name: username,
      email,
    };
  }

  async createUser(payload: CreateUserDTO) {
    // create user in database
    return this.usersService.createUser(payload);
  }

  async updateUser(payload: UpdateUserDTO) {
    // update user in database
    return this.usersService.updateUser({ userId: payload.userId }, payload);
  }
}

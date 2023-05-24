import { Injectable } from '@nestjs/common';

import { CreateUserDTO, UpdateUserDTO } from '../../users/dto/user.dto';
import { UsersService } from '../../users/services/users.service';

import { ClerkPayload, ParcialPayload } from '../dto/clerk-auth.dto';
import { FoldersService } from '../../folders/services/folders.service';
import { DefaultFolders } from '../../auth/constants';

@Injectable()
export class ClerkAuthService {
  constructor(
    private usersService: UsersService,
    private foldersService: FoldersService,
  ) {}

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
    const user = await this.usersService.createUser(payload);
    // create user folder and shared folder
    await this.foldersService.createUserFolder(
      user.userId,
      DefaultFolders.ROOT,
    );
    await this.foldersService.createUserFolder(
      user.userId,
      DefaultFolders.SHARED,
    );
    return user;
  }

  async updateUser(payload: UpdateUserDTO) {
    // update user in database
    return this.usersService.updateUser({ userId: payload.userId }, payload);
  }
}

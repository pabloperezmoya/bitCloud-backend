import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getAllUsers() {
    return this.userModel.find().exec();
  }

  async createUser(user: CreateUserDTO) {
    // Check if user already exists
    const userLookup = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (userLookup) {
      throw new NotFoundException('User not found');
    }

    // hash password and lowercase name
    //user.password = await argon2.hash(user.password).;
    user.password = await bcrypt.hash(user.password, 10); // TODO: REMOVE THIS
    user.name = user.name.toLowerCase();

    // Create new user
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async updateUser(findBy: object, userPayload: UpdateUserDTO) {
    // lowercase name
    if (userPayload.name) {
      userPayload.name = userPayload.name.toLowerCase();
    }
    // hashing password
    if (userPayload.password) {
      userPayload.password = await bcrypt.hash(userPayload.password, 10);
    }

    const user = await this.userModel
      .findOneAndUpdate(findBy, { $set: userPayload }, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUser(findBy: object) {
    const user = await this.userModel.findOne(findBy).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAllUserFolders(userId: string, populateFolders = false) {
    let folders;
    if (!populateFolders) {
      folders = await this.userModel
        .findOne({ userId })
        .select('folders')
        .exec();
    } else {
      folders = await this.userModel
        .findOne({ userId })
        .select('folders')
        .populate('folders')
        .exec();
    }

    return folders;
  }
}

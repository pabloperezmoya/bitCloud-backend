import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../entities/user.entity';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';
import { type Storage } from '@storage/types/storage';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, // Injecting the model // Delete the following line //@Inject('STORAGE') private storage: Storage, // Injecting the storage service
  ) {}

  async getAllUsers() {
    return this.userModel.find().exec();
  }

  async createUser(user: CreateUserDTO) {
    // Check if user already exists
    const userLookup = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (userLookup) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    // hash password and lowercase name
    //user.password = await argon2.hash(user.password).;
    user.password = await bcrypt.hash(user.password, 10);
    user.name = user.name.toLowerCase();

    // Create new user
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async updateUser(id: string, userPayload: UpdateUserDTO) {
    // lowercase name
    if (userPayload.name) {
      userPayload.name = userPayload.name.toLowerCase();
    }
    // hashing password
    if (userPayload.password) {
      userPayload.password = await bcrypt.hash(userPayload.password, 10);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, { $set: userPayload }, { new: true })
      .exec();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}

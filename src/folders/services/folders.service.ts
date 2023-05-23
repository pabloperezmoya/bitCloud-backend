import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Folder } from '../entities/folder.entity';
import { Model } from 'mongoose';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class FoldersService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<Folder>,
    private usersService: UsersService,
  ) {}

  async getFolder(userId: string, folderName) {
    const folder = await this.getFolderByName(folderName, userId);
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    return folder;
  }

  async getAllUserFolders(userId: string, populate = false) {
    const user = await this.usersService.getAllUserFolders(userId, populate);

    if (!user) {
      throw new NotFoundException('Folder not found');
    }
    return user.folders;
  }

  async createUserFolder(userId: string, folderName: string) {
    const user = await this.usersService.getUser({ userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // verify if folder already exists
    folderName = folderName.trim().toLowerCase();
    const folderExists = await this.checkIfFolderExists(folderName, userId);

    if (folderExists) {
      throw new ConflictException('Folder already exists');
    }
    // create folder
    const folder = await this.createFolder(folderName, userId);
    // add folder to user
    user.folders.push(folder._id);
    user.save();
    return folder._id;
  }

  async deleteUserFolder(userId: string, folderName: string) {
    const user = await this.usersService.getUser({ userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // verify if folder exists
    const folderExists = await this.checkIfFolderExists(folderName, userId);

    if (!folderExists) {
      throw new NotFoundException('Folder not found');
    }

    // delete folder
    const folder = await this.deleteFolder(folderName, userId);

    // remove folder from user
    user.updateOne({ $pull: { folders: folder._id } }).exec();
  }

  async createFolder(folderName: string, ownerId: string) {
    const folder = new this.folderModel({
      folderName,
      ownerId,
    });
    return folder.save();
  }

  async getFoldersByOwnerId(ownerId: string) {
    return this.folderModel.find({ ownerId }).exec();
  }

  async checkIfFolderExists(folderName: string, ownerId: string) {
    const folder = await this.folderModel
      .findOne({ folderName, ownerId })
      .exec();
    return folder ? true : false;
  }

  async getFolderByName(folderName: string, ownerId: string) {
    const folder = await this.folderModel
      .findOne({ folderName, ownerId })
      .exec();
    return folder;
  }

  async deleteFolder(folderName: string, ownerId: string) {
    return this.folderModel.findOneAndDelete({ folderName, ownerId }).exec();
  }
}

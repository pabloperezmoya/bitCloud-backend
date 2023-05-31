import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectTorrentCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Storage } from '../../config/storage/types/storage';
import { Model } from 'mongoose';
import { v4 as uuid4 } from 'uuid';
import { StorageFile } from '../entities/storage.entity';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FoldersService } from '../../folders/services/folders.service';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';

type fileType = {
  _id: string;
  fileKey: string;
  userId: string;
  originalName: string;
  mimetype: string;
  size: number;
  sharedWith: [];
  folderId: string;
  createdAt: string;
  __v: number;
};

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE') private storage: Storage,
    @InjectModel(StorageFile.name) private storageModel: Model<StorageFile>,
    private usersService: UsersService,
    private foldersService: FoldersService,
  ) {}

  async generateUUID() {
    return uuid4();
  }

  async deleteFolder(userId: string, folderName: string) {
    const user = await this.usersService.getUser({ userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // verify if folder exists
    const folderExists = await this.foldersService.checkIfFolderExists(
      folderName,
      userId,
    );

    if (!folderExists) {
      throw new NotFoundException('Folder not found');
    }

    const folder: any = await this.foldersService.getFolder(
      userId,
      folderName,
      true,
    );

    folder.files.forEach((file: fileType) => {
      this.deleteFile(file.fileKey);
    });

    // delete folder
    await this.foldersService.deleteFolder(folderName, userId);

    // // remove folder from user
    user.updateOne({ $pull: { folders: folder._id } }).exec();
  }

  async saveFile(file: Express.Multer.File) {
    // Generate a unique key for the file
    const fileId = await this.generateUUID();
    // Save file to user storage
    await this.storage.S3.send(
      new PutObjectCommand({
        Bucket: this.storage.bucketName,
        Key: fileId,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return fileId;
  }
  async saveToDatabase(
    fileKey: string,
    userId: string,
    file: Express.Multer.File,
    folderName: string,
  ) {
    const { originalname, mimetype, size } = file;

    // Get folderID by folderName
    const exists = await this.foldersService.checkIfFolderExists(
      folderName,
      userId,
    );
    if (!exists) {
      throw new Error('Folder does not exist');
    }
    const folder = await this.foldersService.getFolderByName(
      folderName,
      userId,
    );

    // TODO: Implement versioning
    // Check if file already exists
    const fileExists = await this.storageModel
      .findOne({ userId })
      .where('originalName')
      .equals(originalname)
      .where('folderId')
      .equals(folder._id)
      .exec();

    if (fileExists) {
      // Implement versioning
      throw new ConflictException('File already exists');
    }

    // Adding to storage collection
    const storageFile = new this.storageModel({
      fileKey,
      userId: userId,
      originalName: originalname,
      mimetype,
      size,
      folderId: folder._id,
    });
    await storageFile.save();

    this.foldersService.addFileToFolder(folder._id, storageFile._id);
    return storageFile;
  }

  async deleteFile(fileKey: string) {
    // Delete file from storage service
    return await this.storage.S3.send(
      new DeleteObjectCommand({
        Bucket: this.storage.bucketName,
        Key: fileKey,
      }),
    );
  }

  async deleteFileFromDatabase(userId: string, fileKey: string) {
    try {
      // Delete file from storage collection
      const file = await this.storageModel
        .findOneAndDelete({ fileKey, userId })
        .exec();

      // Delete file from folder
      this.foldersService.removeFileFromFolder(
        file.folderId.toString(),
        file._id,
      );
    } catch (err) {
      return true;
    }
  }

  async getFile(fileId: string) {
    return await this.storageModel.findOne({ fileKey: fileId }).exec();
  }

  async streamFile(fileKey) {
    const fileStream = await this.storage.S3.send(
      new GetObjectCommand({
        Bucket: this.storage.bucketName,
        Key: fileKey,
      }),
    );
    return fileStream.Body;
  }

  async makeFilePublic(fileKey, expiresIn) {
    if (!expiresIn) {
      expiresIn = 60 * 60 * 24 * 7; // 7 days
    }

    const publicFileUrl = await getSignedUrl(
      this.storage.S3,
      new GetObjectCommand({
        Bucket: this.storage.bucketName,
        Key: fileKey,
      }),
      { expiresIn },
    );
    return {
      publicFileUrl,
      expiresIn,
    };
  }

  async createShare(fileId) {
    const shareId = await this.generateUUID();
    await this.storageModel.findOneAndUpdate(
      {
        fileKey: fileId,
      },
      {
        $set: { shareId },
      },
    );
    return shareId;
  }

  async getFileByShareId(shareId) {
    return await this.storageModel.findOne({ shareId }).exec();
  }

  async addUserToFileDocument(fileId, userId) {
    return await this.storageModel.findOneAndUpdate(
      {
        fileKey: fileId,
      },
      {
        $addToSet: { sharedWith: userId },
      },
    );
  }

  async addFileToRootFolder(fileId, userId) {
    return this.foldersService.addFileToRootFolder(fileId, userId);
  }

  async addFileToSharedFolder(fileId, userId) {
    return this.foldersService.addFileToSharedFolder(fileId, userId);
  }

  async removeFileFromSharedFolder(fileId, userId) {
    return this.foldersService.removeFileFromSharedFolder(fileId, userId);
  }

  async removeUserFromFileDocument(fileId, userId) {
    return await this.storageModel.findOneAndUpdate(
      {
        fileKey: fileId,
      },
      {
        $pull: { sharedWith: userId },
      },
    );
  }

  async deleteShareIdFromFileDocument(fileId) {
    return await this.storageModel.findOneAndUpdate(
      {
        fileKey: fileId,
      },
      {
        $unset: { shareId: '' },
      },
    );
  }

  async deleteSharedWithFromFileDocument(fileId) {
    return await this.storageModel.findOneAndUpdate(
      {
        fileKey: fileId,
      },
      {
        $unset: { sharedWith: '' },
      },
    );
  }
}

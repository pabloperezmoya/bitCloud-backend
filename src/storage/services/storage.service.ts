import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Storage } from '../../config/storage/types/storage';
import { Model } from 'mongoose';
import { v4 as uuid4 } from 'uuid';
import { StorageFile } from '../entities/storage.entity';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE') private storage: Storage,
    @InjectModel(StorageFile.name) private storageModel: Model<StorageFile>,
  ) {}

  async generateUUID() {
    return uuid4();
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
    fileId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    const { originalname, mimetype, size } = file;
    const storageFile = new this.storageModel({
      fileKey: fileId,
      userId: userId,
      originalName: originalname,
      mimetype,
      size,
    }).save();
    return storageFile;
  }

  async deleteFile(fileId: string) {
    // Delete file from storage service
    return await this.storage.S3.send(
      new DeleteObjectCommand({
        Bucket: this.storage.bucketName,
        Key: fileId,
      }),
    );
  }

  async deleteFileFromDatabase(userId: string, fileId: string) {
    return await this.storageModel
      .deleteOne({ userId, fileKey: fileId })
      .exec();
  }

  async getAllMyFiles(userId: string, skip = 0, limit = 20) {
    return await this.storageModel
      .find({ userId })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getAllSharedFiles(userId: string, skip = 0, limit = 20) {
    return await this.storageModel
      .find({ sharedWith: { $in: [userId] } })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getFile(userId: string, fileId: string) {
    return await this.storageModel.findOne({ userId, fileKey: fileId }).exec();
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

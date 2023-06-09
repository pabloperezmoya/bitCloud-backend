import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/entities/user.entity';

@Schema()
export class StorageFile extends Document {
  @Prop({ required: true, unique: true })
  fileKey: string;

  @Prop({ type: String, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  shareId?: string;

  @Prop()
  sharedWith?: string[];

  @Prop({ type: Types.ObjectId, ref: 'Folder' })
  folderId: Types.ObjectId;
}

export const StorageFileSchema = SchemaFactory.createForClass(StorageFile);

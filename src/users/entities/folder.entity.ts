import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StorageFile } from 'src/storage/entities/storage.entity';
import { User } from './user.entity';

enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  SHARE = 'share',
  ALL = 'all',
}

type SharedWith = {
  userId: string;
  permission: Permission;
};

@Schema()
export class Folder extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  ownerId: string;

  @Prop({ required: true })
  folderName: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: StorageFile.name }] })
  files?: Types.ObjectId[];

  @Prop()
  sharedWith?: SharedWith[];

  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(Folder);

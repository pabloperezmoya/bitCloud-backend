import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Folder } from '../../folders/entities/folder.entity';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  authMethod: AuthMethods;

  @Prop({ type: [{ type: Types.ObjectId, ref: Folder.name }] })
  folders?: Types.ObjectId[];
}

export enum AuthMethods {
  CLERK = 'clerkdev',
  LOCAL = 'local',
}

export const UserSchema = SchemaFactory.createForClass(User);

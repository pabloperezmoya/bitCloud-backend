import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  id: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);

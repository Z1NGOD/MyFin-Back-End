import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

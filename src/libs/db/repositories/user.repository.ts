import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@libs/db/models/user.schema';

interface UserContext {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  create(createUserDto: UserContext) {
    const createdUser = new this.UserModel(createUserDto);
    return createdUser.save();
  }

  findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }

  findOne(_id: string): Promise<User> {
    return this.UserModel.findOne({ _id }).exec();
  }

  update(_id: string, updateUserDto: UserContext): Promise<User> {
    return this.UserModel.findOneAndUpdate({ _id }, updateUserDto, {
      new: true,
    });
  }

  remove(_id: string) {
    return this.UserModel.deleteOne({ _id });
  }
}

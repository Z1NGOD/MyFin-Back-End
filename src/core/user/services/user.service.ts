import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '@core/auth/dto';
import { User } from '@libs/db/models/user.schema';
import { UpdateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.UserModel(createUserDto);
    return createdUser.save();
  }

  findAll(): Promise<User[]> {
    return this.UserModel.find().exec();
  }

  findOne(_id: string): Promise<User> {
    return this.UserModel.findOne({ _id }).exec();
  }

  update(_id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.UserModel.findOneAndUpdate({ _id }, updateUserDto, {
      new: true,
    });
  }

  remove(_id: string) {
    return this.UserModel.deleteOne({ _id });
  }
}

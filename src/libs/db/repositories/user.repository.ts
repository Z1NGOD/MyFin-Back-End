import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, UpdateUserDto } from '@core/user/dto';
import { User, UserDocument } from '../models/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.UserModel(createUserDto);
    return createdUser.save();
  }

  findAll(): Promise<UserDocument[]> {
    return this.UserModel.find().exec();
  }

  findOne(_id: string): Promise<UserDocument> {
    return this.UserModel.findOne({ _id }).exec();
  }

  findByEmail(email: string): Promise<UserDocument> {
    return this.UserModel.findOne({ email }).exec();
  }

  update(_id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.UserModel.findOneAndUpdate({ _id }, updateUserDto, {
      new: true,
    });
  }

  remove(_id: string) {
    return this.UserModel.deleteOne({ _id });
  }
}

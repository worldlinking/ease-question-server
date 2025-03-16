import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(userData: CreateUserDto) {
    const user = new this.userModel(userData);
    return await user.save();
  }

  async findOne(username: string, password: string) {
    return await this.userModel.findOne({ username, password });
  }
}

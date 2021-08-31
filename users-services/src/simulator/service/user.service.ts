import { User } from '../model/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly user: Model<User>) {}

  async get(): Promise<Array<User>> {
    return await this.user.find();
  }

  async getById(id: string | number): Promise<User> {
    return await this.user.findById(id);
  }

  async save(user: User): Promise<void> {
    await new this.user(user).save();
  }

  async update(user: User, id: string | number): Promise<void> {
    await this.user.updateOne({ _id: id }, user);
  }

  async delete(id: string | number): Promise<void> {
    await this.user.deleteOne({ _id: id });
  }

  async register(user: User): Promise<void> {
    user.password =  await bcrypt.hash(user.password, 12);
    return this.save(user);
  }

}

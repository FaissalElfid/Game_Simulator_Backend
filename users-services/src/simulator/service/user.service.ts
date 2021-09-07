import { User } from '../model/user.model';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserLoginI } from '../interface/user.interface';
import * as randomToken from 'rand-token';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly user: Model<User>) {}


  public async getRefreshToken(userId: number): Promise<string> {
    let user = await this.getById(userId);
    user.refreshToken = randomToken.generate(16);
    user.refreshTokenExp = moment().minutes(5).format('YYYY/MM/DD'); 
    user.save();
    return user.refreshTokenExp;
  }

  async get(): Promise<Array<User>> {
    return await this.user.find();
  }

  async getById(id: string | number) {
    const user =  await this.user.findById(id);
    return user;
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
  async login(userLogin: UserLoginI){
    const user = await this.user.findOne({email: userLogin.email}).select('+password').exec();

    if(!user){
      return null;
    }
    if(!await bcrypt.compare(userLogin.password, user.password)){
      return null;
    }
    return user.id;
  }
}

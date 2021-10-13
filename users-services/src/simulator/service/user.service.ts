import { BadgeUnlocked, User } from '../model/user.model';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserLoginI } from '../interface/user.interface';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { firstLetterCapital } from '../utils/methods';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly user: Model<User>) {}
  async get(): Promise<Array<User>> {
    return await this.user.find();
  }

  async getById(id: string | number) {
    let user = await this.user.findOne({ _id: id });
    let {
      name,
      email,
      level,
      description,
      badgesUnlocked,
      isAdmin,
      profileImage,
      lastName,
      phoneNumber,
      challengeProgress,
    } = user;
    return {
      id,
      name,
      email,
      level,
      description,
      badgesUnlocked,
      isAdmin,
      profileImage,
      lastName,
      phoneNumber,
      challengeProgress,
    };
  }

  async save(user: User) {
    try {
      return await (
        await new this.user(user).save()
      ).id;
    } catch (err) {
      return {
        statusCode: '404',
        message: "Sorry !! We can't register this user for the moment.",
      };
    }
  }

  async update(user: User, id: string | number): Promise<any> {
    try {
      await this.user.updateOne({ _id: id }, user);
      return {
        message: 'Your profile is updated succefully !!',
      };
    } catch (err) {
      return err;
    }
  }

  async updateBadgeCounter(
    id: string,
    badgeId: string,
    counter: number,
  ): Promise<any> {
    try {
      let user: User = await (
        await this.user.findOne({ _id: id })
      ).execPopulate();
      if (user.badgesUnlocked.length > 0) {
        user.badgesUnlocked.forEach((element, index) => {  
          let found = false;
          if (element.badge.toString()  === badgeId) {
            element.counter = counter;
            found = true;
          }else if(index === user.badgesUnlocked.length -1 && !found){
            user.badgesUnlocked.push({counter: counter, badge: badgeId})
          }
        });
      } else {
        user.badgesUnlocked.push({counter: counter, badge: badgeId})
      }
      
      console.log(user, counter)
      await user.save();
      return {
        message: 'Your badge counter is updated succefully !!',
      };
    } catch (err) {
      return err;
    }
  }

  async updateChallengeProgress(
    userId: string,
    challengeId: string,
    progress: number,
  ): Promise<any> {
    try {
      if(!this.user.exists({_id: userId}))throw new Error("user not found");
      
      console.log("service :" + progress)

      let user: User = await (
        await this.user.findOne({ _id: userId })
      ).execPopulate();
      if (user.challengeProgress.length > 0) {
        user.challengeProgress.forEach((element, index) => {  
          let found = false;
          if (element.challenge.toString()  === challengeId) {
            console.log("found")
            element.progress = progress;
            found = true;
          }else if(index === user.badgesUnlocked.length -1 && !found){
            console.log(" not found")
            user.challengeProgress.push({challenge: challengeId, progress: progress})
          }
        });
      } else {
        console.log("array not found")
        user.challengeProgress.push({challenge: challengeId, progress: progress})
      }
      
      console.log(user, progress)
      await user.save();
      return {
        message: 'Your challenge progress is updated succefully !!',
      };
    } catch (err) {
      return err;
    }
  }

  async updatePassword(id: string, password: string): Promise<any> {
    try {
      const newPassword = await bcrypt.hash(password, 12);
      await this.user.updateOne({ _id: id }, { password: newPassword });
      return {
        message: 'Your password is updated succefully !!',
      };
    } catch (err) {
      return err;
    }
  }

  async delete(id: string | number): Promise<any> {
    return await (
      await this.user.deleteOne({ _id: id })
    ).ok;
  }

  async register(user: User): Promise<string | any> {
    user.password = await bcrypt.hash(user.password, 12);
    user.name = firstLetterCapital(user.name);
    return this.save(user);
  }
  async login(userLogin: UserLoginI) {
    const user = await this.user
      .findOne({ email: userLogin.email })
      .select('+password')
      .exec();

    if (!user) {
      return null;
    }
    if (!(await bcrypt.compare(userLogin.password, user.password))) {
      return null;
    }
    return { id: user.id, isAdmin: user.isAdmin };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Badge } from '../model/badge.model';

@Injectable()
export class BadgeService {
  constructor(
    @InjectModel('Badge') private readonly challengeModel: Model<Badge>,
  ) {}

  async insertBadge(title: string, desc: string, pronos: number, level: string) {
    if(this.verifieLevel(level)){
      const newBadge = new this.challengeModel({
        title,
        description: desc,
        pronos,
        level
      });
      const result = await newBadge.save();
      return result.id as string;
    } else{
      // throw new NotFoundException('Could not find level.');
      return 'level not defined in our program';
    }
    
  }

  async getBadges() {
    const challenges = await this.challengeModel.find().exec();
    return challenges.map(chal => ({
      id: chal.id,
      title: chal.title,
      description: chal.description,
      pronos: chal.pronos,
      level: chal.level
    }));
  }

  async getSingleBadge(challengeId: string) {
    const challenge = await this.findBadge(challengeId);
    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      pronos: challenge.pronos,
      level: challenge.level
    };
  }

  async updateBadge(
    challengeId: string,
    title: string,
    desc: string,
    pronos: number,
    level: string
  ) {
    const updatedBadge = await this.findBadge(challengeId);

    if (title) {
      updatedBadge.title = title;
    }
    if (desc) {
      updatedBadge.description = desc;
    }
    if (pronos) {
      updatedBadge.pronos = pronos;
    }
    if (level && this.verifieLevel(level)) {
      updatedBadge.level = level;
    }
    updatedBadge.save();
  }

  async deleteBadge(prodId: string) {
    const result = await this.challengeModel.deleteOne({_id: prodId}).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find challenge.');
    }
  }

  private async findBadge(id: string): Promise<Badge> {
    let challenge;
    try {
      challenge = await this.challengeModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find challenge.');
    }
    if (!challenge) {
      throw new NotFoundException('Could not find challenge.');
    }
    return challenge;
  }

  verifieLevel(level: string) {
    const levels = ['none', 'bronze', 'silver', 'gold'];
    if(!levels.includes(level)){
      // throw new NotFoundException('Could not find level.');
      return false;
    }else return true;
  }
}
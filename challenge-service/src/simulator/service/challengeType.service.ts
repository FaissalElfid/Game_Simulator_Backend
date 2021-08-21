import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ChallengeType } from '../model/ChallengeType.model';

@Injectable()
export class ChallengeTypeService {
  constructor(
    @InjectModel('ChallengeType') private readonly challengeTypeModel: Model<ChallengeType>,
  ) {}

  async insertChallengeType(challengeType: ChallengeType) {
    await new this.challengeTypeModel(challengeType).save();
    // const newChallengeType = new this.challengeTypeModel({
    //   title,
    //   description: desc,
    // });
    // const result = await newChallengeType.save();
    // return result.id as string;
  }

  async getChallengeTypes() {
    return await this.challengeTypeModel.find().populate('challenges');
  }

  async getSingleChallenge(challengeId: string) {
    const challenge = await this.findChallenge(challengeId);
    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
    };
  }

  async updateChallenge(
    challengeId: string,
    title: string,
    desc: string,
  ) {
    const updatedChallenge = await this.findChallenge(challengeId);
    if (title) {
      updatedChallenge.title = title;
    }
    if (desc) {
      updatedChallenge.description = desc;
    }
    updatedChallenge.save();
  }

  async deleteChallenge(prodId: string) {
    const result = await this.challengeTypeModel.deleteOne({_id: prodId}).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find challenge. (delete challenge)');
    }
  }

  private async findChallenge(id: string): Promise<ChallengeType> {
    let challenge;
    try {
      challenge = await this.challengeTypeModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find challenge type error!! (findchallenge()).');
    }
    if (!challenge) {
      
      throw new NotFoundException('Could not find challenge type (findchallenge()).');
    }
    return challenge;
  }
}
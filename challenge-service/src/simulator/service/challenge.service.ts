import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Challenge } from '../model/challenge.model';
import { ChallengeType, ChallengeTypeI } from '../model/ChallengeType.model';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('ChallengeType') private readonly typeChallengeModel: Model<ChallengeType>
  ) {}

  async insertChallenge(challenge: Challenge, challengeType: ChallengeTypeI): Promise<void> {
    console.log(challengeType)
    await new this.challengeModel(challenge).save().then(async (c) => {
      let challenges = [];
      let newChallengeType = {challenges, ...challengeType};
      newChallengeType.challenges.push(c.id);
      await this.typeChallengeModel.updateOne({ _id: challengeType.id}, newChallengeType);
  })
} 

  async getChallenges() {
    return await this.challengeModel.find()
  }

  async getSingleChallenge(challengeId: string) {
    return await this.challengeModel.findById(challengeId).populate('challengeType');
  }

  async updateChallenge(
    challengeId: string, challenge: Challenge
  ) {
    const updatedChallenge = await this.findChallenge(challengeId);
    if (challenge.title) {
      updatedChallenge.title = challenge.title;
    }
    if (challenge.description) {
      updatedChallenge.description = challenge.description;
    }
    if (challenge.reunlockable) {
      updatedChallenge.reunlockable = challenge.reunlockable;
    }
    updatedChallenge.save();
  }

  async deleteChallenge(prodId: string) {
    const result = await this.challengeModel.deleteOne({_id: prodId}).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find challenge (not found exception).');
    }
  }
 
  private async findChallenge(id: string): Promise<Challenge> {
    let challenge;
    try {
      challenge = await this.challengeModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find challenge (not found exception) (findChallengeFunction).');
    }
    if (!challenge) {
      throw new NotFoundException('Could not find challenge (not found exception) ( no challenge found).');
    }
    return challenge;
  }
}
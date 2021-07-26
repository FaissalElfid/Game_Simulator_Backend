import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Challenge } from '../model/challenge.model';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
  ) {}

  async insertChallenge(title: string, desc: string) {
    const newChallenge = new this.challengeModel({
      title,
      description: desc,
    });
    const result = await newChallenge.save();
    return result.id as string;
  }

  async getChallenges() {
    const challenges = await this.challengeModel.find().exec();
    return challenges.map(prod => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
    }));
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
    const result = await this.challengeModel.deleteOne({_id: prodId}).exec();
    if (result.n === 0) {
      throw new NotFoundException('Could not find challenge.');
    }
  }

  private async findChallenge(id: string): Promise<Challenge> {
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
}
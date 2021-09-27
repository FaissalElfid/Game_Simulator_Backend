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
    if(!await this.challengeTypeModel.exists({title: challengeType.title})){
      const id = await (await new this.challengeTypeModel(challengeType).save()).id;
      return {id: id, message: "this challenge type added succefully"}
    }else{
      return {type:"error", message: "this challenge type already exist"}
    }
    
  }

  async getChallengeTypes() {
    return await this.challengeTypeModel.find().populate('challenges');
  }

  async getSingleChallenge(challengeId: string) {
    return await this.findChallenge(challengeId);
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
      challenge = await this.challengeTypeModel.findById(id).populate('challenges');
    } catch (error) {
      throw new NotFoundException('Could not find challenge type error!! (findchallenge()).');
    }
    if (!challenge) {
      return null;
      // throw new NotFoundException('Could not find challenge type (findchallenge()).');
    }
    return challenge;
  }
}
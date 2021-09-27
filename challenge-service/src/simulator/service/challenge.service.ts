import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Challenge, ChallengeSchema } from '../model/challenge.model';
import { ChallengeType, ChallengeTypeI } from '../model/ChallengeType.model';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('ChallengeType')
    private readonly typeChallengeModel: Model<ChallengeType>,
  ) {}

  async insertChallenge(
    challenge: Challenge,
    challengeType: ChallengeTypeI,
  ): Promise<void> {
    var result;
    if (challenge.reunlockable) {
      await new this.challengeModel(challenge).save().then(async c => {
        result = await this.addChallengeToChallengeType(c, challengeType);
      });
    } else {
      ChallengeSchema.set('badgeSilver', undefined, { strict: false });
      await new this.challengeModel(challenge).save().then(async c => {
        result = await this.addChallengeToChallengeType(c, challengeType);
      });
    }
    return await result;
  }

  async addChallengeToChallengeType(
    challenge: Challenge,
    challengeType: ChallengeTypeI,
  ) {
    try {
      if (challengeType.challenges !== undefined) {
        console.log(
          'the challenge length : ' + challengeType.challenges.length,
        );

        challengeType.challenges.push(challenge.id);
        await this.typeChallengeModel.updateOne(
          { _id: challengeType.id },
          challengeType,
        );
      } else {
        let challenges = [];
        let newChallengeType = { challenges, ...challengeType };
        newChallengeType.challenges.push(challenge.id);
        await this.typeChallengeModel.updateOne(
          { _id: challengeType.id },
          newChallengeType,
        );
      }
      return {
        id: challengeType.id,
        message: 'this challenge added succefully',
      };
    } catch (err) {
      return err;
    }
  }

  async getChallenges() {
    return await this.challengeModel.find().populate('challengeType','title');
  }

  async getSingleChallenge(challengeId: string) {
    try {
      return await this.challengeModel.findById(challengeId).exec();
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async updateChallenge(challengeId: string, challenge: Challenge) {
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
    const result = await this.challengeModel.deleteOne({ _id: prodId }).exec();
    if (result.n === 0) {
      throw new BadRequestException(
        'Could not find challenge (not found exception).',
      );
    }
  }

  private async findChallenge(id: string): Promise<Challenge> {
    let challenge;
    try {
      challenge = await this.challengeModel.findById(id).exec();
    } catch (error) {
      throw new BadRequestException(
        'Could not find challenge (not found exception) (findChallengeFunction).',
      );
    }
    if (!challenge) {
      throw new BadRequestException(
        'Could not find challenge (not found exception) ( no challenge found).',
      );
    }
    return challenge;
  }
}

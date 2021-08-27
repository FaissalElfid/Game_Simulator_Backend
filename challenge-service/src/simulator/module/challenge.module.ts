import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChallengeController } from '../controller/challenge.controller';
import { ChallengeService } from '../service/challenge.service';
import { ChallengeSchema } from '../model/challenge.model';
import { ChallengeTypeService } from '../service/challengeType.service';
import { ChallengeTypeSchema } from '../model/ChallengeType.model';
import { ChallengeTypeController } from '../controller/challengeType.controller';
import { BadgeController } from '../controller/badge.controller';
import { BadgeService } from '../service/badge.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Challenge', schema: ChallengeSchema },
      { name: 'ChallengeType', schema: ChallengeTypeSchema },
    ]),
  ],
  controllers: [ChallengeController, ChallengeTypeController, BadgeController],
  providers: [ChallengeService, ChallengeTypeService, BadgeService],
})
export class ChallengeModule {}

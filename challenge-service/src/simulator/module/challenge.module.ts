import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChallengeController } from '../controller/challenge.controller';
import { ChallengeService } from '../service/challenge.service';
import { ChallengeSchema } from '../model/challenge.model';
import { BadgeSchema } from '../model/badge.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
    MongooseModule.forFeature([{ name: 'Badge', schema: BadgeSchema }]),
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
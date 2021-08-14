import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChallengeTypeController } from '../controller/challengeType.controller';
import { ChallengeTypeService } from '../service/challengeType.service';
import { ChallengeTypeSchema } from '../model/challengeType.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ChallengeType', schema: ChallengeTypeSchema }]),
  ],
  controllers: [ChallengeTypeController],
  providers: [ChallengeTypeService],
})
export class ChallengeTypeModule {}
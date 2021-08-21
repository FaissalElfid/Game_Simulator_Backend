import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { BadgeModule } from './simulator/module/badge.module';
import { ChallengeModule } from './simulator/module/challenge.module';
import { ChallengeTypeModule } from './simulator/module/challengeType.module';

@Module({
  imports: [
    ChallengeModule,
    // ChallengeTypeModule,
    BadgeModule,
    
    MongooseModule.forRoot(
      'mongodb+srv://faissal:FaissalFaissal@cluster0.bhlgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ChallengeModule } from './simulator/module/challenge.module';

@Module({
  imports: [
    ChallengeModule,
    MongooseModule.forRoot(
      'mongodb+srv://faissal:FaissalFaissal@cluster0.bhlgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
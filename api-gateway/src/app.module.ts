import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges/challengesType.controller';

@Module({
  imports: [],
  controllers: [ChallengesController],
  providers: [],
})
export class AppModule {}

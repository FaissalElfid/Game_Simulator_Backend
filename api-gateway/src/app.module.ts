import { Module } from '@nestjs/common';
import { ChallengesController } from './posts/posts.controller';

@Module({
  imports: [],
  controllers: [ChallengesController],
  providers: [],
})
export class AppModule {}

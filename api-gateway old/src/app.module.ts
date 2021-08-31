import { Module } from '@nestjs/common';
import { BadgesController } from './badges/badge.controller';
import { ChallengeTypeController } from './challengeType/challengesType.controller';
import { ChallengeController } from './challenge/challenge.controller';

import { ClientsModule, Transport } from '@nestjs/microservices';
// import { UserController } from './user/user.controller';
@Module({
  imports: [ClientsModule.register([
    {
      name: 'KAFKA_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'client',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'client-consumer',
        },
      },
    },
  ]),],
  controllers: [ChallengeTypeController,BadgesController,ChallengeController],
  providers: [],
})
export class AppModule {}

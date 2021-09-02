import { Module } from '@nestjs/common';
import { BadgesController } from './badges/badge.controller';
import { ChallengeTypeController } from './challengeType/challengesType.controller';
import { ChallengeController } from './challenge/challenge.controller';
import { JwtModule } from '@nestjs/jwt';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user/user.controller';

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
  ]),
  JwtModule.register({
    secret: 'faissalfaissalfaissal',
    signOptions: {expiresIn: '1d'}
  })
],
  controllers: [ChallengeTypeController,BadgesController,ChallengeController,UserController],
  providers: [],
})
export class AppModule {}

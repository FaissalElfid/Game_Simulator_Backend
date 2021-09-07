import { Module } from '@nestjs/common';
import { BadgesController } from './badges/badge.controller';
import { ChallengeTypeController } from './challengeType/challengesType.controller';
import { ChallengeController } from './challenge/challenge.controller';
import { JwtModule } from '@nestjs/jwt';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { LocalStrategy } from './utils/strategies/local.strategy';
import { JwtStrategy } from './utils/strategies/jwt.strategy';
import { RefreshStrategy } from './utils/strategies/refresh.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    JwtModule.register({
      secret: 'My random secret key never let others',
      signOptions: {
        expiresIn: 30,
      },
    }),
    ClientsModule.register([
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
  ]),PassportModule
],
  controllers: [ChallengeTypeController,BadgesController,ChallengeController,UserController],
  providers: [UserService,LocalStrategy, JwtStrategy, RefreshStrategy],
  exports: [],
})
export class AppModule {}

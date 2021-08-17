import { Module } from '@nestjs/common';
import { BadgesController } from './badges/badge.controller';
import { ChallengesController } from './challenges/challengesType.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
  controllers: [ChallengesController,BadgesController],
  providers: [],
})
export class AppModule {}

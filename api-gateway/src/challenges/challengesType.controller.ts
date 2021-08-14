import { Delete, Patch, Put } from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';

@Controller('challengetype')
export class ChallengesController {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'challenges',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'challenges-consumer',
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf('add.new.challengeType');
    this.client.subscribeToResponseOf('get.challengesType.list');
    this.client.subscribeToResponseOf('getById.challengeType');
    this.client.subscribeToResponseOf('updateById.challengeType');
    this.client.subscribeToResponseOf('deleteById.challengeType');

    await this.client.connect();
  }

  @Post('/')
  appPost(@Body() challenge: Challenge) {
    return this.client.send('add.new.challengeType', challenge);
  }

  @Get('/')
  getList() {
    return this.client.send('get.challengesType.list', '');
  }
  @Get('/:id')
  getChallenge(@Param('id') prodId: string) {
    return this.client.send('getById.challengeType', prodId);
  }
  @Patch(':id')
  async updateChallenge(
    @Param('id') id: string,
    @Body() challenge: Challenge
  ) {
    const challengeDto = {id, ...challenge};
    return this.client.send('updateById.challengeType', challengeDto);
  }
  @Delete(':id')
  async deleteChallenge(
    @Param('id') idChallenge: string,
  ) {
    return this.client.send('deleteById.challengeType', idChallenge);
  }
}

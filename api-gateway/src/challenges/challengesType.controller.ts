import { Delete, Patch, Put } from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Challenge } from './interfaces/challenge.interface';

@Controller('challenges')
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
    this.client.subscribeToResponseOf('add.new.challenge');
    this.client.subscribeToResponseOf('get.challenges.list');
    this.client.subscribeToResponseOf('getById.challenge');
    this.client.subscribeToResponseOf('updateById.challenge');
    this.client.subscribeToResponseOf('deleteById.challenge');

    await this.client.connect();
  }

  @Post('/')
  appPost(@Body() challenge: Challenge) {
    return this.client.send('add.new.challenge', challenge);
  }

  @Get('/')
  getList() {
    return this.client.send('get.challenges.list', '');
  }
  @Get('/:id')
  getChallenge(@Param('id') prodId: string) {
    return this.client.send('getById.challenge', prodId);
  }
  @Patch(':id')
  async updateChallenge(
    @Param('id') id: string,
    @Body() challenge: Challenge
  ) {
    const challengeDto = {id, ...challenge};
    return this.client.send('updateById.challenge', challengeDto);
  }
  @Delete(':id')
  async deleteChallenge(
    @Param('id') idChallenge: string,
  ) {
    return this.client.send('deleteById.challenge', idChallenge);
  }
}

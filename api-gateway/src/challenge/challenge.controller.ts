import { Delete, Patch, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Challenge } from './interface/challenge.interface';

@Controller('challenge')
export class ChallengeController  implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}
  async onModuleInit() {
    ['add.new.challenge', 'get.challenges.list', 'getById.challenge', 'updateById.challenge', 'deleteById.challenge'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));

    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.close();
  }

  @Post('/:idType')
  appPost(@Body() challenge: Challenge, @Param('idType') typeChallengeId: string) {
    const challengeDto = {typeChallengeId, challenge};
    return this.client.send('add.new.challenge', challengeDto);
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

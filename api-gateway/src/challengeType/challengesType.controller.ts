import { Delete, Patch, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Challenge } from './interfaces/challengeType.interface';

@Controller('challengetype')
export class ChallengeTypeController  implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}
  async onModuleInit() {
    // await kafkaPath(this.client);
    ['add.new.challengeType', 'get.challengesType.list', 'getById.challengeType', 'updateById.challengeType', 'deleteById.challengeType'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));

    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.close();
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

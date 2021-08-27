import { Delete, Patch, Put } from '@nestjs/common';
import { Body, Controller, Get, Param, Post, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Badge } from './interfaces/badge.interface';

@Controller('badge')
export class BadgesController implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleDestroy() {
    await this.client.close();
  }
  async onModuleInit() {
    ['add.new.badge.challenge', 'get.challenge.badges.list', 'getById.badge', 'updateById.badge', 'deleteById.badge'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));

    await this.client.connect();
  }

  @Post('/:challengeId')
  appPost(@Body() badge: Badge,@Param('challengeId') challengeId : string) {
    let badgeSaveDto = {challengeId, badge}
    return this.client.send('add.new.badge.challenge', badgeSaveDto);
  }

  @Get('/challenge/:challengeId')
  getList(@Param('challengeId') challengeId : string) {
    return this.client.send('get.challenge.badges.list', challengeId);
  }

  
  @Get('/badge/:id')
  getBadge(@Param('id') badgeId: string) {
    return this.client.send('getById.badge', badgeId);
  }

  //not created yet
  @Patch(':idChallenge/:idBadge')
  async updateBadge(
    @Param('idChallenge') idChallenge: string,
    @Param('idBadge') idBadge: string,
    @Body() badge: Badge
  ) {
    const badgeDto = {idChallenge, idBadge, badge};
    return this.client.send('updateById.badge', badgeDto);
  }

  @Delete(':challengeId/:badgeId')
  async deleteBadge(
    @Param('challengeId') challengeId: string,
    @Param('badgeId') badgeId: string,
  ) {
    let badgeDeleteDto = {badgeId,challengeId};
    return this.client.send('deleteById.badge', badgeDeleteDto);
  }
}

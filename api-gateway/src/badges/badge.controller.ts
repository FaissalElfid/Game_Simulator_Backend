import { Delete, Patch, Put } from '@nestjs/common';
import { Body, Controller, Get, Param, Post, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { kafkaPath } from 'src/utils/kafkaPaths';
import { Badge } from './interfaces/badge.interface';

@Controller('badge')
export class BadgesController implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleDestroy() {
    await this.client.close();
  }
  async onModuleInit() {
    // await kafkaPath(this.client);
    ['add.new.badge', 'get.badges.list', 'getById.badge', 'updateById.badge', 'deleteById.badge'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));

    await this.client.connect();
  }

  @Post('/')
  appPost(@Body() badge: Badge) {
    return this.client.send('add.new.badge', badge);
  }

  @Get('/')
  getList() {
    return this.client.send('get.badges.list', '');
  }
  @Get('/:id')
  getBadge(@Param('id') prodId: string) {
    return this.client.send('getById.badge', prodId);
  }
  @Patch(':id')
  async updateBadge(
    @Param('id') id: string,
    @Body() badge: Badge
  ) {
    const badgeDto = {id, ...badge};
    return this.client.send('updateById.badge', badgeDto);
  }
  @Delete(':id')
  async deleteBadge(
    @Param('id') idBadge: string,
  ) {
    return this.client.send('deleteById.badge', idBadge);
  }
}

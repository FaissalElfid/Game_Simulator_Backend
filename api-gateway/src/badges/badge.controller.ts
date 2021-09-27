import { Delete, Patch, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Body, Controller, Get, Param, Post, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Badge } from './interfaces/badge.interface';
import { diskStorage } from 'multer';
import { Response, Request } from 'express';

import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { Observable, of } from 'rxjs';
import { join } from 'path';

export const storage = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // user id
      const dir = `./uploads/badgeimages/`;
      return cb(null, dir);
    },
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};
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
  @UseInterceptors(FileInterceptor('file', storage))
  appPost(@UploadedFile() file, @Req() request: Request) {
    let badge: Badge = request.body
    let challengeId = request.params.challengeId
    let badgeSaveDto = {challengeId, badge}
    badge.image = `http://localhost:3000/badge/badge-image/${file.filename}`; // change this in production
    console.log(badge)
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
  @Get('badge-image/:imagename')
  findProfileImage(
    @Param('imagename') imagename,
    @Res() res,
  ): Observable<Object> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/badgeimages/' + imagename)),
    );
  }
}

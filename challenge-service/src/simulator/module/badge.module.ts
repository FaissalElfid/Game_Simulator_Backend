import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BadgeController } from '../controller/badge.controller';

import { BadgeSchema } from '../model/badge.model';
import { BadgeService } from '../service/badge.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Badge', schema: BadgeSchema }]),
  ],
  controllers: [BadgeController],
  providers: [BadgeService],
})
export class BadgeModule {}
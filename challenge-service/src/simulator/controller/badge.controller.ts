import {
    Controller,
  } from '@nestjs/common';
  import {MessagePattern, Payload} from "@nestjs/microservices";
  import {IKafkaMessage} from "../../interfaces/kafka-message.interface";
  import {IBadge, IBadgeId} from '../interface/badge.interface';
  import { BadgeService } from '../service/badge.service';
  
@Controller('badges')
  export class BadgeController {
    constructor(private readonly badgeService: BadgeService) {}
    @MessagePattern('add.new.badge')
    addBadge(
      @Payload() messageKafka: IKafkaMessage<IBadge>) {
      return this.badgeService.insertBadge(
        messageKafka.value.title,
        messageKafka.value.description,
        messageKafka.value.pronos,
        messageKafka.value.level,
      );
    }
  
    @MessagePattern('get.badges.list')
    getAllBadge() {
      return this.badgeService.getBadges();
    }

    @MessagePattern('getById.badge')
    getBadge(@Payload() messageKafka: IKafkaMessage<string>) {
      return this.badgeService.getSingleBadge(messageKafka.value);
    }

    @MessagePattern('updateById.badge')
    async updateBadge(@Payload() messageKafka: IKafkaMessage<IBadgeId>) {
      return this.badgeService.updateBadge(messageKafka.value.id, messageKafka.value.title, messageKafka.value.description, messageKafka.value.pronos, messageKafka.value.level);
    }
    @MessagePattern('deleteById.badge')
    async removeBadge(@Payload() messageKafka: IKafkaMessage<string>) {
        return this.badgeService.deleteBadge(messageKafka.value);
    }
  }
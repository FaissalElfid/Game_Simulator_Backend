import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IKafkaMessage } from '../../interfaces/kafka-message.interface';
import { BadgeDeleteI, BadgeSaveI, BadgeUpdateI } from '../interface/badge.interface';
import { Challenge } from '../model/challenge.model';
import { BadgeService } from '../service/badge.service';
import { ChallengeService } from '../service/challenge.service';

@Controller('badges')
export class BadgeController {
  constructor(
    private readonly badgeService: BadgeService,
    private challengeService: ChallengeService,
  ) {}

  // add a new badge to spesific challenge 
  @MessagePattern('add.new.badge.challenge')
  async addBadge(@Payload() messageKafka: IKafkaMessage<BadgeSaveI>) {
    let challenge;
    console.log(messageKafka.value.badge)
    await this.challengeService
      .getSingleChallenge(messageKafka.value.challengeId)
      .then((res: Challenge): Challenge => (challenge = res));
    return this.badgeService.insertBadgeInChallenge(
      messageKafka.value.badge,
      challenge,
    );
  }
  // here i get all the challenge badges
  @MessagePattern('get.challenge.badges.list')
  async getAllChallengeBadges(@Payload() messageKafka: IKafkaMessage<string>) {
    let challenge;
    await this.challengeService
      .getSingleChallenge(messageKafka.value)
      .then((res: Challenge): Challenge => (challenge = res));
      let badges;
    if(challenge.reunlockable) badges = {badges_bronze: challenge.badges, badges_gold: challenge.badgeGold, badges_silver: challenge.badgeSilver}
    else badges = {badges: challenge.badges};
    badges.challengeId = messageKafka.value;
    return badges;
  }

  // here we update the badge using challenge id and badge (passed in the parameters) plus the badge object 
  @MessagePattern('updateById.badge')
  async updateBadge(@Payload() messageKafka: IKafkaMessage<BadgeUpdateI>) {
    let challenge;
    await this.challengeService
      .getSingleChallenge(messageKafka.value.idChallenge)
      .then((res: Challenge): Challenge => (challenge = res));
      console.log("badge id : "+ messageKafka.value.idBadge);
    return this.badgeService.updateById(
      challenge,
      messageKafka.value.idBadge,
      messageKafka.value.badge
    );
  }

  // to delete a badge we use the challenge id and badge id 
  @MessagePattern('deleteById.badge')
  async delete(@Payload() messageKafka: IKafkaMessage<BadgeDeleteI>) {
    let challenge;
    await this.challengeService
      .getSingleChallenge(messageKafka.value.challengeId)
      .then((res: Challenge): Challenge => (challenge = res));
      return this.badgeService.deleteBadgeInChallenge(challenge,messageKafka.value.badgeId)
  }

  
}

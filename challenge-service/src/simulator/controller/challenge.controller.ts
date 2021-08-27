import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IKafkaMessage } from '../../interfaces/kafka-message.interface';
import { ChallengeService } from '../service/challenge.service';
import { Challenge, ChallengeSave } from '../model/challenge.model';
import { ChallengeTypeService } from '../service/challengeType.service';
import { ChallengeType } from '../interface/ChallengeType.interface';

@Controller('challenges')
export class ChallengeController {
  constructor(
    private challengeService: ChallengeService,
    private challengeTypeService: ChallengeTypeService,
  ) {}
  @MessagePattern('add.new.challenge')
  async addChallenge(@Payload() messageKafka: IKafkaMessage<ChallengeSave>) {
    let challengeType;
    await this.challengeTypeService
      .getSingleChallenge(messageKafka.value.typeChallengeId)
      .then((res: ChallengeType): ChallengeType => (challengeType = res));
    messageKafka.value.challenge.challengeType = messageKafka.value.typeChallengeId;
    return this.challengeService.insertChallenge(
      messageKafka.value.challenge,
      challengeType,
    );
  }

  @MessagePattern('get.challenges.list')
  getAllChallenge() {
    return this.challengeService.getChallenges();
  }

  // also add the api path on the api-gateway
  @MessagePattern('getById.challenge')
  getChallenge(@Payload() messageKafka: IKafkaMessage<string>) {
    return this.challengeService.getSingleChallenge(messageKafka.value);
  }

  @MessagePattern('updateById.challenge')
  async updateChallenge(@Payload() messageKafka: IKafkaMessage<Challenge>) {
    return this.challengeService.updateChallenge(
      messageKafka.value.id,
      messageKafka.value,
    );
  }
// i should remove it also from the challenge type (model)
  @MessagePattern('deleteById.challenge')
  async removeChallenge(@Payload() messageKafka: IKafkaMessage<string>) {
    return this.challengeService.deleteChallenge(messageKafka.value);
  }
}

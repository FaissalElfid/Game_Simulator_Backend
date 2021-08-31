import {
    Controller,
  } from '@nestjs/common';
  import {MessagePattern, Payload} from "@nestjs/microservices";
  import {IKafkaMessage} from "../../interfaces/kafka-message.interface";
import { IChallengeId, IChallenge } from '../interface/challengeType.interface';
  import { ChallengeTypeService } from '../service/challengeType.service';
  import { ChallengeType } from '../model/ChallengeType.model';

@Controller('challengeTypes')
  export class ChallengeTypeController {
    constructor(private readonly challengeTypeService: ChallengeTypeService) {}
    @MessagePattern('add.new.challengeType')
    addChallenge(
      @Payload() messageKafka: IKafkaMessage<ChallengeType>) {
      return this.challengeTypeService.insertChallengeType(
        messageKafka.value
      );
    }
  
    @MessagePattern('get.challengesType.list')
    getAllChallenge() {
      return this.challengeTypeService.getChallengeTypes();
    }

    @MessagePattern('getById.challengeType')
    getChallenge(@Payload() messageKafka: IKafkaMessage<string>) {
      return this.challengeTypeService.getSingleChallenge(messageKafka.value);
    }

    @MessagePattern('updateById.challengeType')
    async updateChallenge(@Payload() messageKafka: IKafkaMessage<IChallengeId>) {
      return this.challengeTypeService.updateChallenge(messageKafka.value.id, messageKafka.value.title, messageKafka.value.description);
    }
    @MessagePattern('deleteById.challengeType')
    async removeChallenge(@Payload() messageKafka: IKafkaMessage<string>) {
        return this.challengeTypeService.deleteChallenge(messageKafka.value);
    }
  }
import {
    Controller,
  } from '@nestjs/common';
  import {MessagePattern, Payload} from "@nestjs/microservices";
  import {IKafkaMessage} from "../../interfaces/kafka-message.interface";
import { IChallengeId, IChallenge } from '../interface/challengeType.interface';
  import { ChallengeTypeService } from '../service/challengeType.service';
  
@Controller('challengeTypes')
  export class ChallengeTypeController {
    constructor(private readonly challengeTypeService: ChallengeTypeService) {}
    @MessagePattern('add.new.challengeType')
    addChallenge(
      @Payload() messageKafka: IKafkaMessage<IChallenge>) {
      return this.challengeTypeService.insertChallengeType(
        messageKafka.value.title,
        messageKafka.value.description,
      );
    }
  
    @MessagePattern('get.challengesType.list')
    getAllChallenge() {
      return this.challengeTypeService.getChallengeTypes();
    }

    // also add the api path on the api-gateway
    @MessagePattern('getById.challengeType')
    getChallenge(@Payload() messageKafka: IKafkaMessage<string>) {
      return this.challengeTypeService.getSingleChallenge(messageKafka.value);
      // return this.challengeTypeService.getSingleChallenge(messageKafka.value.id);
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
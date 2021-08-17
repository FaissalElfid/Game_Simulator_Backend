import {
    Controller,
  } from '@nestjs/common';
  import {MessagePattern, Payload} from "@nestjs/microservices";
  import {IKafkaMessage} from "../../interfaces/kafka-message.interface";
  import {IChallenge, IChallengeId} from '../interface/challenge.interface';
  import { ChallengeService } from '../service/challenge.service';
  
@Controller('challenges')
  export class ChallengeController {
    constructor(private readonly challengeService: ChallengeService) {}
    @MessagePattern('add.new.challenge')
    addChallenge(
      @Payload() messageKafka: IKafkaMessage<IChallenge>) {
      return this.challengeService.insertChallenge(
        messageKafka.value.title,
        messageKafka.value.description,
        messageKafka.value.reunlockable,
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
    async updateChallenge(@Payload() messageKafka: IKafkaMessage<IChallengeId>) {
      return this.challengeService.updateChallenge(messageKafka.value.id, messageKafka.value.title, messageKafka.value.description, messageKafka.value.reunlockable);
    }
    
    @MessagePattern('deleteById.challenge')
    async removeChallenge(@Payload() messageKafka: IKafkaMessage<string>) {
        return this.challengeService.deleteChallenge(messageKafka.value);
    }
  }
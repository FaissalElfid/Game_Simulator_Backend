import {
    Controller,
    Body,
    Get,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
  import {MessagePattern, Payload} from "@nestjs/microservices";
  import {IKafkaMessage} from "../../interfaces/kafka-message.interface";
  import {IChallenge} from '../interface/challenge.interface';
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
      );
    }
  
    @MessagePattern('get.challenges.list')
    getAllChallenge() {
      return this.challengeService.getChallenges();
    }
  
    @Get(':id')
    getChallenge(@Param('id') prodId: string) {
      return this.challengeService.getSingleChallenge(prodId);
    }
  
    @Patch(':id')
    async updateChallenge(
      @Param('id') prodId: string,
      @Body('title') prodTitle: string,
      @Body('description') prodDesc: string,
    ) {
      await this.challengeService.updateChallenge(prodId, prodTitle, prodDesc);
      return null;
    }
  
    @Delete(':id')
    async removeChallenge(@Param('id') prodId: string) {
        await this.challengeService.deleteChallenge(prodId);
        return null;
    }
  }
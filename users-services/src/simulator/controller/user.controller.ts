import { User } from '../model/user.model';
import { UserService } from '../service/user.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IKafkaMessage } from 'src/interfaces/kafka-message.interface';
import { UserLoginI, UserUpdate, UserUpdateBadgeCounter, UserUpdateChallengeProgress, UserUpdatePassword } from '../interface/user.interface';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get.users.list')
  async get() {
    return await this.userService.get();
  }

  @MessagePattern('getById.user')
  async getById(@Payload() messageKafka: IKafkaMessage<string>) {
    return await this.userService.getById(messageKafka.value);
  }

  @MessagePattern('add.new.user')
  async save(@Payload() messageKafka: IKafkaMessage<User>) {
    await this.userService.save(messageKafka.value);
  }

  @MessagePattern('updateById.user')
  async update(@Payload() messageKafka: IKafkaMessage<UserUpdate>) {
    return await this.userService.update(
      messageKafka.value.user,
      messageKafka.value.id,
    );
  }

  @MessagePattern('deleteById.user')
  async delete(@Payload() messageKafka: IKafkaMessage<string>) {
    await this.userService.delete(messageKafka.value);
  }

  @MessagePattern('register.new.user')
  async register(@Payload() messageKafka: IKafkaMessage<User>) {
    try {
      return await this.userService.register(messageKafka.value);
    } catch (error) {
      return error;
    } 
  }

  @MessagePattern('update.user.password')
  async updatePassword(@Payload() messageKafka: IKafkaMessage<UserUpdatePassword>) {
    return await this.userService.updatePassword(
      messageKafka.value.id, messageKafka.value.password
    );
  }

  @MessagePattern('login.user')
  async login(@Payload() messageKafka: IKafkaMessage<UserLoginI>) {
    return this.userService.login(messageKafka.value);
  }

  @MessagePattern('update.user.badge.counter')
  async updateCounter(@Payload() messageKafka: IKafkaMessage<UserUpdateBadgeCounter>) {
    return this.userService.updateBadgeCounter(messageKafka.value.id, messageKafka.value.badgeId, messageKafka.value.counter);
  }
  @MessagePattern('update.user.challenge.progress')
  async updateChallengeProgress(@Payload() messageKafka: IKafkaMessage<UserUpdateChallengeProgress>) {
    console.log("controller :" + messageKafka.value.progress)
    return this.userService.updateChallengeProgress(messageKafka.value.idUser, messageKafka.value.challenge, messageKafka.value.progress);
  }
}

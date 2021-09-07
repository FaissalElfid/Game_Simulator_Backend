import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserLoginI } from './interfaces/user.interface';


@Injectable()
export class UserService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
  ) {}
  async onModuleInit() {
    [
      'login.user',
    ].forEach((key) => this.client.subscribeToResponseOf(`${key}`));

    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.close();
  }
  async validateUserCredentials(userDto: UserLoginI){
    return await firstValueFrom(this.client.send('login.user', userDto));
}
  
}

import { Delete, Patch, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { User } from './interfaces/user.interface';

@Controller('user')
export class UserController  implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}
  async onModuleInit() {
    ['add.new.user', 'get.users.list','register.new.user', 'getById.user', 'updateById.user', 'deleteById.user'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));

    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.close();
  }

  @Post('/add')
  addUser(@Body() user: User) {
    return this.client.send('add.new.user', user);
  }

  @Post('/')
  register(@Body() user: User) {
    return this.client.send('register.new.user', user);
  }

  @Get('/')
  getList() {
    return this.client.send('get.users.list', '');
  }
  @Get('/:id')
  getUser(@Param('id') userId: string) {
    return this.client.send('getById.user', userId);
  }
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: User
  ) {
    const userDto = {id, user};
    return this.client.send('updateById.user', userDto);
  }
  @Delete(':id')
  async deleteUser(
    @Param('id') idUser: string,
  ) {
    return this.client.send('deleteById.user', idUser);
  }
}

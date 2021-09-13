import {
  Delete,
  Patch,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { User, UserLoginI } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { saveIdOnCookie } from 'src/utils/methods';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    private jwtService: JwtService,
  ) {}
  async onModuleInit() {
    [
      'add.new.user',
      'get.users.list',
      'register.new.user',
      'getById.user',
      'updateById.user',
      'deleteById.user',
      'login.user',
    ].forEach((key) => this.client.subscribeToResponseOf(`${key}`));

    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.close();
  }
  // register
  @Post('/')
  register(@Body() user: User) {
    return this.client.send('register.new.user', user);
  }

  @Post('/login/')
  @UseGuards(AuthGuard('local'))
  async login(
    @Body() userDto: UserLoginI,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userId = await firstValueFrom(this.client.send('login.user', userDto))
    return await saveIdOnCookie(userId, response, this.jwtService)
  }

  @Get('/cookie')
  async user(@Req() request: Request) {
    try {
      var cookie = request.cookies['jwt'];
      var data = await this.jwtService.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException();
      }
      var user =  await this.getUser(data.id);


      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  } 

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'success',
    };
  }

  // crud
  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  getList(@Req() req) {
    return this.client.send('get.users.list', '');
  }
  @Get('/:id')
  getUser(@Param('id') userId: string) {
    return this.client.send('getById.user', userId);
  }
  @Post('/add')
  addUser(@Body() user: User) {
    return this.client.send('add.new.user', user);
  }
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() user: User) {
    const userDto = { id, user };
    return this.client.send('updateById.user', userDto);
  }
  @Delete(':id')
  async deleteUser(@Param('id') idUser: string) {
    return this.client.send('deleteById.user', idUser);
  }
}

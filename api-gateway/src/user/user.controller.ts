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
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Response, Request } from 'express';
import { UpdateCounter, User, UserLoginI, UserUpdatePassword } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { saveIdOnCookie } from 'src/utils/methods';
import { firstValueFrom, map, Observable, of, tap } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import path = require('path');
import { join } from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { unlink } from 'fs/promises';
export const storage = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // user id
      const dir = `./uploads/profileimages/`;
      return cb(null, dir);
    },
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};
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
      'update.user.password',
      'update.user.badge.counter' 
    ].forEach((key) => this.client.subscribeToResponseOf(`${key}`));

    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.close();
  }
  // register
  @Post('/:userid/:badgeid')
  updateUserBadge(@Param('userid') id: string,@Param('badgeid') badgeId: string,@Body() counterObj: UpdateCounter) {
    const counter = counterObj.counter
    const userUpdateCounterDto = {id,badgeId,counter}
    console.log(userUpdateCounterDto)
    return this.client.send('update.user.badge.counter', userUpdateCounterDto);
  }
  
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
    const userId = await firstValueFrom(
      this.client.send('login.user', userDto),
    );
    return await saveIdOnCookie(userId, response, this.jwtService);
  }

  @Get('/cookie')
  async user(@Req() request: Request) {
    try {
      var cookie = request.cookies['jwt'];
      var data = await this.jwtService.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException();
      }
      var user = await this.getUser(data.id);

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
  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(@UploadedFile() file, @Req() request: Request) {
    try {
      const user: User = await firstValueFrom(await this.user(request));
      if (user.profileImage !== '') {
        await unlink('./uploads/profileimages/' + user.profileImage)
          .then(() => console.log('file deleted succefully'))
          .catch((err) => console.log(err));
      }
      user.profileImage = file.filename;
      return await this.updateUser(user.id, user);
    } catch (err) {
      return {
        error_message: err,
      };
    }
  }

  @Get('profile-image/:imagename')
  @UseGuards(AuthGuard('jwt'))
  findProfileImage(
    @Param('imagename') imagename,
    @Res() res,
  ): Observable<Object> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)),
    );
  }

  // crud
  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  getList(@Req() req) {
    return this.client.send('get.users.list', '');
  }
  @Get('/:id')
  getUser(@Param('id') userId: string): Observable<User> {
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
  @Post('/update-password')
  updatePassword(@Body() newPassword: UserUpdatePassword) {
    return this.client.send('update.user.password', newPassword);
  }
}

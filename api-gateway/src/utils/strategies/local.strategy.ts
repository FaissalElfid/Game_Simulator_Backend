import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { CurrentUser } from 'src/user/interfaces/user.interface';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<CurrentUser> {
    let user = await this.userService.validateUserCredentials({email, password});
    console.log("local : "+ user )
    if (user == null) {
      throw new UnauthorizedException("Invalid email or password !!");
    }
    return user;
  }
}

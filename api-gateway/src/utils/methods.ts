import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

export async function saveIdOnCookie(userId: any, response: Response, jwtService: JwtService) {
    if (userId) {
        console.log(userId);
        const jwt = await jwtService.signAsync({id: userId.id});
  
        response.cookie('jwt', jwt, {httpOnly: true});
        return { message: 'success', isAdmin: userId.isAdmin };
      } else {
        return { message: 'failed' };
      }
}
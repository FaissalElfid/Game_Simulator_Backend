import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

export async function saveIdOnCookie(userId: string, response: Response, jwtService: JwtService) {
    if (userId) {
        console.log(userId);
        const jwt = await jwtService.signAsync({id: userId});
  
        response.cookie('jwt', jwt, {httpOnly: true});
        return { message: 'success' };
      } else {
        return { message: 'failed' };
      }
}
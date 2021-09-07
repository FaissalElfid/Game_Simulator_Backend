import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
    constructor(){
        super({
            ignoreExpiration: false,
            secretOrKey:"My random secret key never let others",
            jwtFromRequest:ExtractJwt.fromExtractors([(request:Request) => {
                let data = request?.cookies["jwt"];
                if(!data){
                    return null;
                }
                return data // normaly we should read data and return data.id
            }])
        });
    }

    async validate(payload:any){
        if(payload === null){
            throw new UnauthorizedException();
        }
        return ['payload'];
    }
}

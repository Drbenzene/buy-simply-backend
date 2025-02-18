import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['token']; // Extract the n JWT from the 'token' cookie
          }
          if (request && request.headers && request.headers.authorization) {
            token = request.headers.authorization.replace('Bearer ', ''); // Extract the JWT from the Authorization header
          }
          console.log('Token:', token);
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'BUYSIMPLEJWTSECRET', // Use config or environment variable
    });
  }

  async validate(payload: { userId: number; email: string }) {
    return payload; // Payload contains user information
  }
}

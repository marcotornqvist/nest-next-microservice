import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@prisma/client';
import { PrismaService } from '@app/common';

export interface TokenPayload {
  userId: string;
}

// Get this microservice implementation to work first with Prisma and then progress to implement Cognito.
// Learn how all different controllers/services work together and simple them down if needed.

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: 'aioskdfoij',
    };

    const expires = new Date();

    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    console.log(user);
    console.log(token);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }
}

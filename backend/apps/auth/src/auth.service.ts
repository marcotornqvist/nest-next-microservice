import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from '@app/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  private sessionUserAttributes: Record<string, unknown>;
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: configService.get('COGNITO_USER_POOL_ID'),
      ClientId: configService.get('COGNITO_CLIENT_ID'),
    });
  }

  async register(
    @Body() { name, email, password, confirmPassword }: RegisterUserDto,
  ) {
    await this.usersService.validateEmail(email);
    await this.usersService.validatePassword(password, confirmPassword);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
      },
    });

    if (!user) {
      throw new BadRequestException("Something wen't wrong.");
    }

    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        user.id,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (!result) {
            // Delete user from Prisma DB if Cognito wasn't able to create a user.
            this.prisma.user.delete({
              where: {
                id: user.id,
              },
            });

            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  async login(@Body() { email, password }: LoginUserDto, response: Response) {
    const { id: userId } = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (!userId) {
      throw new NotFoundException('No user was found.');
    }

    const authenticationDetails = new AuthenticationDetails({
      Username: userId,
      Password: password,
    });

    const userData = {
      Username: userId,
      Pool: this.userPool,
    };

    return new Promise((resolve, reject) => {
      return new CognitoUser(userData).authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          this.setAuthToken(result, response);
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  logout(response: Response) {
    this.usersService.removeAuthToken(response);
  }

  private setAuthToken(result: CognitoUserSession, response: Response) {
    const payload = result.getIdToken().payload;
    const token = result.getIdToken().getJwtToken();
    const addTime = payload.exp - payload.iat;
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + addTime);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }
}

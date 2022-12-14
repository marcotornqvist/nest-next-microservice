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
  CognitoIdToken,
  CognitoRefreshToken,
} from 'amazon-cognito-identity-js';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { response, Response } from 'express';
import { PrismaService } from '@app/common';
import { UsersService } from './users/users.service';
import { Request } from 'express-jwt';

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
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user.id) {
      throw new NotFoundException('No user was found.');
    }

    const authenticationDetails = new AuthenticationDetails({
      Username: user.id,
      Password: password,
    });

    const userData = {
      Username: user.id,
      Pool: this.userPool,
    };

    return await new Promise((resolve, reject) => {
      return new CognitoUser(userData).authenticateUser(authenticationDetails, {
        onSuccess: (result: CognitoUserSession) => {
          // const refreshToken = result.getRefreshToken();
          // const accessToken = result.getAccessToken();
          // const idToken = result.getIdToken();

          this.setAuthToken(result, response);
          resolve(result);
          // resolve({ idToken });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  // Use the refresh function below to return a new access token.
  // TODO: Get refresh token from cookies (not from argument).
  // TODO: Create a function that returns a new accessToken & IdToken. Hint: getCognitoUser & getUserSession below does that.
  // TODO: Return IdToken or AccessToken to client.
  // TODO: Set AccessToken in memory on client (globalState).

  // https://github.com/frsechet/cognito-user-pool/blob/5e228d09a11e0944674b34b266c02e91a6f08090/src/methods/refreshSession.js
  // https://github.com/frsechet/cognito-user-pool/blob/5e228d09a11e0944674b34b266c02e91a6f08090/src/helpers/index.js
  // const result = await this.getUserSession(cognitoUser, refreshToken);

  async refresh(request: Request) {
    const UserIdCookie = request.cookies?.UserId;
    const RefreshTokenCookie = request.cookies?.Authentication;

    const userData = new CognitoUser({
      Username: UserIdCookie,
      Pool: this.userPool,
    });

    const refreshToken = new CognitoRefreshToken({
      RefreshToken: RefreshTokenCookie,
    });

    return await new Promise((resolve, reject) => {
      userData.refreshSession(
        refreshToken,
        (err, result: CognitoUserSession) => {
          if (err) {
            return reject(err);
          }

          const idToken = result.getIdToken();
          return resolve({ idToken });
        },
      );
    });
  }

  async logout(response: Response) {
    this.usersService.removeAuthToken(response);
  }

  private setAuthToken(result: CognitoUserSession, response: Response) {
    // const payload = result.getIdToken().payload;
    // const token = result.getIdToken().getJwtToken();
    // const payload = result.getAccessToken().payload;
    const userId = result.getIdToken().payload['cognito:username'];
    const token = result.getRefreshToken().getToken();
    console.log(userId);

    // Expiry date is in 30 days, which is the default expiry date for refreshToken in AWS Cognito.
    const date = new Date();
    const expires = new Date(date.setDate(date.getDate() + 30));

    // const isProduction = process.env.NODE_ENV === 'production';

    response.cookie('Authentication', token, {
      httpOnly: true,
      path: '/',
      expires,
      // sameSite: isProduction ? 'none' : false,
      // secure: isProduction,
    });

    response.cookie('UserId', userId, {
      httpOnly: true,
      path: '/',
      expires,
      // sameSite: isProduction ? 'none' : false,
      // secure: isProduction,
    });
  }
}

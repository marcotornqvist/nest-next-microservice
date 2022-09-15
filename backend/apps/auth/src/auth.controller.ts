import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { User } from '@prisma/client';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtAuthGuard as CommonJwtAuthGuard } from '@app/common';
import { Request } from 'express-jwt';

/*
TODO:
Backend: User signs in -> Returns idToken + expiration time and sets userId + refreshToken in cookies.

Frontend: idToken is set in react globalState -> refresh accessToken with passed onto backend with headers

-> create private routes for routes when not authenticated


*/

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    return await this.authService.register(body);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(body, response);
  }

  @Post('refresh')
  async refresh(@Req() request: Request) {
    // FIXME: figure out how to get userId without idToken or by passing userId from client
    // since idToken won't persist when browser is closed
    // see if you can possibly get userId from refreshToken

    // console.log('Inside');
    // !! user.id cannot come from currentUser if only refreshToken exists.

    return await this.authService.refresh(request);
  }

  @Post('guestPost')
  async guestPost(@Req() request: Request) {
    // console.log(request);
    // return await this.authService.authPost(request);
  }

  @Post('authPost')
  @UseGuards(CommonJwtAuthGuard)
  async authPost(@CurrentUser() user: User, @Req() request: Request) {
    console.log(user);
    // console.log(request);
    // return await this.authService.authPost(request);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user;
  }
}

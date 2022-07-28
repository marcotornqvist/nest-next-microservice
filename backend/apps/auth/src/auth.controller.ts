import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }
}

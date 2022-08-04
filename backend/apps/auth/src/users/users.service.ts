import { PrismaService } from '@app/common';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserRequest } from './dto/create-user.request';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(request: CreateUserRequest) {
    await this.validateCreateUserRequest(request);

    const password = await bcrypt.hash(request.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: request.email,
        password,
      },
    });

    return user;
  }

  private async validateCreateUserRequest(request: CreateUserRequest) {
    let user: User;

    try {
      user = await this.prisma.user.findUnique({
        where: {
          email: request.email,
        },
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

    if (user) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }

  async getUser(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}

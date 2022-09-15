import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  RmqModule,
  PrismaModule,
  AuthModule as CommonAuthModule,
} from '@app/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    PrismaModule,
    UsersModule,
    RmqModule,
    CommonAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}

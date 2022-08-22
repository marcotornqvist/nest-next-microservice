import { Module } from '@nestjs/common';
import { AuthModule, PrismaModule, RmqModule } from '@app/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/notification/.env',
    }),
    PrismaModule,
    RmqModule,
    AuthModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}

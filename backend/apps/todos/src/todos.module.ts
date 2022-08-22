import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { PrismaModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { NOTIFICATION_SERVICE } from '@app/utils';
import { AuthModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/todos/.env',
    }),
    RmqModule.register({
      name: NOTIFICATION_SERVICE,
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}

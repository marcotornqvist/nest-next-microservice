import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { PrismaModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { NOTIFICATION_SERVICE } from '@app/utils';
import { AuthModule } from '@app/common';

// create a separate service in the libs folder for the prisma connection.
// seed the database

// first make the microservices talk to each other then follow blog tutorial

// implement swagger
// shared swagger config
// validate the inputs with class-validator
// https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/todos/.env',
    }),
    PrismaModule,
    RmqModule.register({
      name: NOTIFICATION_SERVICE,
    }),
    AuthModule,
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}

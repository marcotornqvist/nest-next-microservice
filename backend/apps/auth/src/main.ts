import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { AuthModule } from './auth.module';
import { RmqOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ValidationPipeErrorsFormatted } from '@app/utils';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, {
    cors: {
      credentials: true,
      origin: 'http://localhost:3000',
    },
  });

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true));
  app.useGlobalPipes(ValidationPipeErrorsFormatted());
  const configService = app.get(ConfigService);

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();

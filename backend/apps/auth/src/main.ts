import { ValidationPipeErrorsFormatted } from '@app/utils';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(ValidationPipeErrorsFormatted());
  await app.listen(4000);
}
bootstrap();

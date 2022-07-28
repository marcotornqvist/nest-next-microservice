import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TodosModule } from './todos.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

function ValidationPipeErrorsFormatted() {
  return new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const result = {};

      validationErrors.forEach((item) => {
        const arrayOfErrors = Object.keys(item.constraints).map(
          (key) => item.constraints[key],
        );

        result[item.property + 'Errors'] = arrayOfErrors;
      });

      return new BadRequestException([result]);
    },
    whitelist: true,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(TodosModule);
  const config = new DocumentBuilder()
    .setTitle('Todos')
    .setDescription('The NestJS Todos API description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(ValidationPipeErrorsFormatted());
  await app.listen(4000);
}
bootstrap();

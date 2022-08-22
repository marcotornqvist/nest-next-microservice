import { NestFactory } from '@nestjs/core';
import { TodosModule } from './todos.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipeErrorsFormatted } from '@app/utils';

async function bootstrap() {
  const app = await NestFactory.create(TodosModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('Todos')
    .setDescription('The NestJS Todos API description')
    .setVersion('0.1')
    .build();

  // When enabling CORS
  // app.enableCors({
  //   origin: ['http://example.com'],
  // });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(ValidationPipeErrorsFormatted());
  await app.listen(4000);
}
bootstrap();

// import {
//   BadRequestException,
//   ValidationError,
//   ValidationPipe,
// } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

// function ValidationPipeErrorsFormatted() {
//   return new ValidationPipe({
//     exceptionFactory: (validationErrors: ValidationError[] = []) => {
//       const result = {};

//       validationErrors.forEach((item) => {
//         const arrayOfErrors = Object.keys(item.constraints).map(
//           (key) => item.constraints[key],
//         );

//         result[item.property + 'Errors'] = arrayOfErrors;
//       });

//       return new BadRequestException([result]);
//     },
//     whitelist: true,
//   });
// }

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  // app.useGlobalPipes(ValidationPipeErrorsFormatted());
  await app.listen(4000);
}
bootstrap();

import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
} from '@nestjs/common';

export function ValidationPipeErrorsFormatted() {
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

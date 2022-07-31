import { Injectable, Logger } from '@nestjs/common';
import { Todo } from '@prisma/client';

@Injectable()
export class NotificationService {
  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async notify(todo: Todo) {
    console.log(todo);
  }
}

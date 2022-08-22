import { Injectable, Logger } from '@nestjs/common';
import { Todo } from '@prisma/client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async notify(todo: Todo) {
    this.logger.log('Notification', todo);
  }
}

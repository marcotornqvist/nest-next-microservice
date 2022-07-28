import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  getHello(): string {
    return 'Hello World!';
  }

  notify(data: any) {
    this.logger.log('Notification...', data);
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  @EventPattern('todo_created')
  // @UseGuards(JwtAuthGuard)
  async handleTodoCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.notificationService.notify(data);
    this.rmqService.ack(context);
  }
}

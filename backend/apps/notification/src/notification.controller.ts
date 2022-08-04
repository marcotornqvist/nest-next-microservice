import { Controller, Get, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { JwtAuthGuard, RmqService } from '@app/common';
import { NotificationService } from './notification.service';
import { Todo } from '@prisma/client';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return this.notificationService.getHello();
  }

  @EventPattern('todo_created')
  @UseGuards(JwtAuthGuard)
  async handleTodoCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.notificationService.notify(data);
    this.rmqService.ack(context);
  }
}

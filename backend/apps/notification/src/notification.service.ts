import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  async notify(todo: Todo) {
    console.log(todo);
  }
}

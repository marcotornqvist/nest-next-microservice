import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { Todo } from '@prisma/client';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from '@app/utils';

@Injectable()
export class TodosService {
  constructor(
    private prisma: PrismaService,
    @Inject(NOTIFICATION_SERVICE) private notificationClient: ClientProxy,
  ) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTodo(
    userId: string,
    { title }: CreateTodoDto,
    authentication: string,
  ): Promise<Todo> {
    try {
      const todo = await this.prisma.todo.create({
        data: {
          title,
          userId,
        },
      });

      // Emit todo to notification service
      this.notificationClient.emit('todo_created', {
        todo,
        Authentication: authentication,
      });

      return todo;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateTodo(id: string, { title }: CreateTodoDto): Promise<Todo> {
    await this.getTodoById(id);

    // Updates the title of the todo
    return this.prisma.todo.update({
      where: {
        id,
      },
      data: {
        title,
      },
    });
  }

  async toggleIsCompletedTodo(id: string): Promise<boolean> {
    const todo = await this.getTodoById(id);

    // Toggle isCompleted from true to false and vice versa
    const { isCompleted } = await this.prisma.todo.update({
      where: {
        id,
      },
      data: {
        isCompleted: !todo.isCompleted,
      },
      select: {
        isCompleted: true,
      },
    });

    return isCompleted;
  }

  async deleteTodo(id: string): Promise<boolean> {
    await this.getTodoById(id);

    // Delete todo
    await this.prisma.todo.delete({
      where: {
        id,
      },
    });

    return true;
  }

  async getTodoById(id: string): Promise<Todo> {
    // Find todo by id
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    // Throw an error if todo doesn't exist
    if (!todo) {
      throw new NotFoundException('Todo Not Found.');
    }

    return todo;
  }
}

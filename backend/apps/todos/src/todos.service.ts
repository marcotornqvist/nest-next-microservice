import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { Todo } from '@prisma/client';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from './constants/services';

@Injectable()
export class TodosService {
  constructor(
    private prisma: PrismaService,
    @Inject(NOTIFICATION_SERVICE) private notificationClient: ClientProxy,
  ) {}

  async getAllTodos(): Promise<Todo[]> {
    // Returns all todos
    return this.prisma.todo.findMany({
      orderBy: { updatedAt: 'desc' },
    });
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
      throw new HttpException('Todo Not Found.', HttpStatus.NOT_FOUND);
    }

    return todo;
  }

  async createTodo({ title }: CreateTodoDto): Promise<Todo> {
    try {
      // Create new todo
      const todo = await this.prisma.todo.create({
        data: {
          title,
          userId: 'f3e6fd06-98d0-4fb8-91ee-2141806d038b',
        },
      });

      this.notificationClient.emit('todo_created', { todo });

      return todo;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateTodo(id: string, { title }: CreateTodoDto): Promise<Todo> {
    // Find todo by id
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    // Throw an error if todo doesn't exist
    if (!todo) {
      throw new HttpException('Todo Not Found.', HttpStatus.NOT_FOUND);
    }

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
    // Find todo by id
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    // Throw an error if todo doesn't exist
    if (!todo) {
      throw new HttpException('Todo Not Found.', HttpStatus.NOT_FOUND);
    }

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
    // Find todo by id
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    // Throw an error if todo doesn't exist
    if (!todo) {
      throw new HttpException('Todo Not Found.', HttpStatus.NOT_FOUND);
    }

    // Delete todo
    await this.prisma.todo.delete({
      where: {
        id,
      },
    });

    return true;
  }
}

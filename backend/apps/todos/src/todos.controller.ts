import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoEntity } from './entities/todo.entity';
import { Todo } from '@prisma/client';

@Controller('todos')
@ApiTags('Todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TodoEntity, isArray: true })
  async getAllTodos(): Promise<Todo[]> {
    return this.todosService.getAllTodos();
  }

  @Get(':id')
  @ApiOkResponse({ type: TodoEntity })
  async getTodoById(@Param('id', ParseUUIDPipe) id: string): Promise<Todo> {
    return this.todosService.getTodoById(id);
  }

  @Post()
  @ApiCreatedResponse({ type: TodoEntity })
  // @UseGuards(JwtAuthGuard)
  async createTodo(
    @Body() body: CreateTodoDto,
    @Req() req: any,
    // @CurrentUser() user: User,
  ): Promise<Todo> {
    return this.todosService.createTodo(
      // user.id,
      '87ef0080-5b10-4482-b539-bcb9cd0d5468',
      body,
      req.cookies?.Authentication,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ type: TodoEntity })
  async updateTodo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateTodoDto,
  ): Promise<Todo> {
    return this.todosService.updateTodo(id, body);
  }

  @Patch('toggleIsCompleted/:id')
  @ApiOkResponse({ type: Boolean })
  async toggleIsCompletedTodo(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<boolean> {
    return this.todosService.toggleIsCompletedTodo(id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteTodo(@Param('id', ParseUUIDPipe) id: string): Promise<boolean> {
    return this.todosService.deleteTodo(id);
  }
}

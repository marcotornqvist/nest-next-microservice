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
import { Todo, User } from '@prisma/client';
import { JwtAuthGuard } from '@app/common';
import { CurrentUser } from 'apps/auth/src/current-user.decorator';

@Controller('todos')
@ApiTags('Todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  // Add role admin to get all todos, also add pagination
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TodoEntity, isArray: true })
  async getAllTodos(@CurrentUser() user: User): Promise<Todo[]> {
    console.log(user);
    return this.todosService.getAllTodos();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TodoEntity, isArray: true })
  async getAllTodosByMe(@CurrentUser() user: User): Promise<Todo[]> {
    return this.todosService.getAllTodosByMe(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: TodoEntity })
  async createTodo(
    @Body() body: CreateTodoDto,
    @Req() req: any,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    return this.todosService.createTodo(
      user.id,
      body,
      req.cookies?.Authentication,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TodoEntity })
  async updateTodo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateTodoDto,
    @CurrentUser() user: User,
  ): Promise<Todo> {
    return this.todosService.updateTodo(user.id, id, body);
  }

  @Patch('toggleIsCompleted/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Boolean })
  async toggleIsCompletedTodo(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.todosService.toggleIsCompletedTodo(user.id, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Boolean })
  async deleteTodo(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.todosService.deleteTodo(user.id, id);
  }
}

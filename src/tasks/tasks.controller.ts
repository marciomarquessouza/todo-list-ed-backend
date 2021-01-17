import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorators';
import { IUser } from 'src/auth/user.interface';
import { CreateTaskDto, FilterTaskDto, UpdateTaskDto } from './dto';
import { TaskStatusPipe } from './pipes/task-status-validation.pipes';
import { TaskEntity } from './tasks.entity';
import { TaskStatus } from './tasks.interface';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  private logger = new Logger('#Task:');
  constructor(private taskService: TasksService) {}

  @Get()
  async getTasks(
    @Query(ValidationPipe) filterTaskDto: FilterTaskDto,
    @GetUser() user: IUser,
  ): Promise<TaskEntity[]> {
    return await this.taskService.getTasks(filterTaskDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: IUser,
  ): Promise<TaskEntity> {
    return await this.taskService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: IUser,
  ): Promise<TaskEntity> {
    this.logger.verbose(
      `User '${user.email}' creating a new task: ${JSON.stringify(
        createTaskDto,
      )}`,
    );
    return this.taskService.createTask(createTaskDto, user);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: IUser,
  ): Promise<TaskEntity> {
    return await this.taskService.updateTask(id, updateTaskDto, user);
  }

  @Patch('/:id/:status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status', TaskStatusPipe) status: TaskStatus,
    @GetUser() user: IUser,
  ): Promise<TaskEntity> {
    this.logger.verbose(
      `User '${user.email}' updating task with id '${id}' to '${status}'`,
    );
    return await this.taskService.updateTaskStatus(id, status, user);
  }

  @Delete('/:id')
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: IUser,
  ): Promise<void> {
    this.logger.verbose(`User '${user.email}' deleting task with id '${id}'`);
    await this.taskService.deleteTask(id, user);
  }
}

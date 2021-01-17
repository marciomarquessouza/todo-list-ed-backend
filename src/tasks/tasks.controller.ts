import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto, FilterTaskDto, UpdateTaskDto } from './dto';
import { TaskStatusPipe } from './pipes/task-status-validation.pipes';
import { TaskEntity } from './tasks.entity';
import { TaskStatus } from './tasks.interface';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getTasks(
    @Query(ValidationPipe) filterTaskDto: FilterTaskDto,
  ): Promise<TaskEntity[]> {
    return await this.taskService.getTasks(filterTaskDto);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskEntity> {
    return await this.taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return this.taskService.createTask(createTaskDto);
  }

  @Put('/:id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    return await this.taskService.updateTask(id, updateTaskDto);
  }

  @Patch('/:id/:status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status', TaskStatusPipe) status: TaskStatus,
  ): Promise<TaskEntity> {
    return await this.taskService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.taskService.deleteTask(id);
  }
}

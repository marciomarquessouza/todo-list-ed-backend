import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.interface';
import { FilterTaskDto, UpdateTaskDto, CreateTaskDto } from './dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterTaskDto: FilterTaskDto): Promise<TaskEntity[]> {
    return await this.taskRepository.getTasks(filterTaskDto);
  }

  async getTaskById(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(`Task with id '${id}' was not found`);
    }

    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const { title, description } = updateTaskDto;
    const task = await this.getTaskById(id);
    task.title = title || task.title;
    task.description = description || task.description;
    await task.save();
    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    task.status = status;

    if (status === TaskStatus.IN_PROGRESS) {
      task.startedAt = new Date();
    }

    if (status === TaskStatus.DONE) {
      task.finishedAt = new Date();
    }

    await task.save();

    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const deleteResult = await this.taskRepository.delete(id);

    if (!deleteResult.affected) {
      throw new NotFoundException(`Task with id '${id}' was not found`);
    }
  }
}

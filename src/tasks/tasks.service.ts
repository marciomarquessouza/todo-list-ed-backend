import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.interface';
import { FilterTaskDto, UpdateTaskDto, CreateTaskDto } from './dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './tasks.entity';
import { IUser } from 'src/auth/user.interface';
import { UserRepository } from 'src/auth/user.repository';
import { ProjectRepository } from 'src/projects/project.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository,
  ) {}

  async getTasks(
    filterTaskDto: FilterTaskDto,
    { id }: IUser,
  ): Promise<TaskEntity[]> {
    return await this.taskRepository.getTasks(filterTaskDto, id);
  }

  async getTaskById(id: number, user: IUser): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with id '${id}' was not found`);
    }

    return task;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    { id: userId }: IUser,
  ): Promise<TaskEntity> {
    const { projectId } = createTaskDto;
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id '${userId}' not found`);
    }

    const project = await this.projectRepository.findOne(projectId);

    if (!project) {
      throw new NotFoundException(
        `Project with id '${projectId}' was not found`,
      );
    }

    return await this.taskRepository.createTask(createTaskDto, user, project);
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: IUser,
  ): Promise<TaskEntity> {
    const { title } = updateTaskDto;
    const task = await this.getTaskById(id, user);
    task.title = title;
    await task.save();
    return task;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: IUser,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);
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

  async deleteTask(id: number, user: IUser): Promise<void> {
    const deleteResult = await this.taskRepository.delete({
      id,
      userId: user.id,
    });

    if (!deleteResult.affected) {
      throw new NotFoundException(`Task with id '${id}' was not found`);
    }
  }
}

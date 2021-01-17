import { Logger } from '@nestjs/common';
import { UserEntity } from 'src/auth/user.entity';
import { ProjectEntity } from 'src/projects/projects.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto, FilterTaskDto } from './dto';
import { TaskEntity } from './tasks.entity';
import { TaskStatus } from './tasks.interface';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  private logger = new Logger('#Task Repository');

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
    project: ProjectEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;

    const task = new TaskEntity();

    task.title = title;
    task.description = description;
    task.createdAt = new Date();
    task.status = TaskStatus.OPEN;
    task.project = project;
    task.user = user;

    try {
      await task.save();
      delete task.user;
      return task;
    } catch (error) {
      this.logger.error(
        `Error to create a new challenge. Data: ${JSON.stringify(
          createTaskDto,
        )}. Error: ${error.message}`,
      );
    }
  }

  async getTasks(
    filterTaskDto: FilterTaskDto,
    userId: number,
  ): Promise<TaskEntity[]> {
    const { status, search, limit, project } = filterTaskDto;

    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (project) {
      query.andWhere('task.projectId = :project', { project });
    }

    if (limit) {
      query.limit(limit);
    }

    const tasks = await query.getMany();

    return tasks;
  }
}

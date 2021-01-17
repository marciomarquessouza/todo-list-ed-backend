import { UserEntity } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto, FilterTaskDto } from './dto';
import { TaskEntity } from './tasks.entity';
import { TaskStatus } from './tasks.interface';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;

    const task = new TaskEntity();

    task.title = title;
    task.description = description;
    task.createdAt = new Date();
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    delete task.user;

    return task;
  }

  async getTasks(
    filterTaskDto: FilterTaskDto,
    userId: number,
  ): Promise<TaskEntity[]> {
    const { status, search, limit } = filterTaskDto;

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

    if (limit) {
      query.limit(limit);
    }

    const tasks = await query.getMany();

    return tasks;
  }
}

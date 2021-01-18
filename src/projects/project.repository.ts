import { InternalServerErrorException, Logger } from '@nestjs/common';
import { UserEntity } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProjectDto, FilterProjectDto } from './dto';
import { ProjectEntity } from './projects.entity';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  private logger = new Logger('#Project Repository');

  async createProject(
    createProjectDto: CreateProjectDto,
    user: UserEntity,
  ): Promise<ProjectEntity> {
    const { title } = createProjectDto;
    const project = new ProjectEntity();
    project.title = title;
    project.createdAt = new Date();
    project.tasks = [];
    project.user = user;
    try {
      await project.save();
      delete project.user;
      return project;
    } catch (error) {
      this.logger.error(
        `Error to create a new project. Data: ${JSON.stringify(
          createProjectDto,
        )}. Error: ${error.message}`,
      );
    }
  }

  async getProjects(
    filterProjectDto: FilterProjectDto,
    userId: number,
  ): Promise<ProjectEntity[]> {
    const { search, limit } = filterProjectDto;

    const query = this.createQueryBuilder('project');

    query.where('project.userId = :userId', { userId });

    if (search) {
      query.andWhere('project.title LIKE :search', { search: `%${search}%` });
    }

    if (limit) {
      query.limit(limit);
    }

    try {
      const projects = await query.getMany();
      return projects;
    } catch (error) {
      throw new InternalServerErrorException(`Occurred an unexpect error`);
    }
  }
}

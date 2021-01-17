import { UserEntity } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProjectDto, FilterProjectDto } from './dto';
import { ProjectEntity } from './projects.entity';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  async createProject(
    createProjectDto: CreateProjectDto,
    user: UserEntity,
  ): Promise<ProjectEntity> {
    const { title, description } = createProjectDto;
    const project = new ProjectEntity();
    project.title = title;
    project.description = description;
    project.createdAt = new Date();
    project.tasks = [];
    project.user = user;
    await project.save();

    delete project.user;

    return project;
  }

  async getProjects(
    filterProjectDto: FilterProjectDto,
    userId: number,
  ): Promise<ProjectEntity[]> {
    const { search, limit } = filterProjectDto;

    const query = this.createQueryBuilder('project');

    query.where('project.userId = :userId', { userId });

    if (search) {
      query.andWhere(
        'project.title LIKE :search OR project.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (limit) {
      query.limit(limit);
    }

    const projects = await query.getMany();

    return projects;
  }
}

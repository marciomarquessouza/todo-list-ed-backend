import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/auth/user.interface';
import { UserRepository } from 'src/auth/user.repository';
import { CreateProjectDto, FilterProjectDto, UpdateProjectDto } from './dto';
import { ProjectRepository } from './project.repository';
import { ProjectEntity } from './projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async getProjects(
    filterProjectDto: FilterProjectDto,
    { id }: IUser,
  ): Promise<ProjectEntity[]> {
    return await this.projectRepository.getProjects(filterProjectDto, id);
  }

  async getProjectById(id: number, user: IUser): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with id '${id}' was not found`);
    }

    return project;
  }

  async createProject(
    createProjectDto: CreateProjectDto,
    { id }: IUser,
  ): Promise<ProjectEntity> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id '${id} was not found`);
    }

    return await this.projectRepository.createProject(createProjectDto, user);
  }

  async updateProject(
    id: number,
    updateProjectDto: UpdateProjectDto,
    user: IUser,
  ): Promise<ProjectEntity> {
    const { title, description } = updateProjectDto;
    const project = await this.getProjectById(id, user);
    project.title = title;
    project.description = description;
    await project.save();
    return project;
  }

  async deleteProject(id: number, user: IUser): Promise<void> {
    const deleteResult = await this.projectRepository.delete({
      id,
      userId: user.id,
    });

    if (!deleteResult.affected) {
      throw new NotFoundException(`Project with id '${id}' was not found`);
    }
  }
}

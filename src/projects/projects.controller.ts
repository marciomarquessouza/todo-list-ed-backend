import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorators';
import { IUser } from 'src/auth/user.interface';
import { CreateProjectDto, FilterProjectDto, UpdateProjectDto } from './dto';
import { ProjectEntity } from './projects.entity';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  private logger = new Logger('#Task:');

  constructor(private projectService: ProjectsService) {}

  @Get()
  async getProjects(
    @Query(ValidationPipe) filterProjectDto: FilterProjectDto,
    @GetUser() user: IUser,
  ): Promise<ProjectEntity[]> {
    return await this.projectService.getProjects(filterProjectDto, user);
  }

  @Get('/:id')
  async getProjecById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: IUser,
  ): Promise<ProjectEntity> {
    return await this.projectService.getProjectById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: IUser,
  ): Promise<ProjectEntity> {
    this.logger.verbose(
      `User '${user.email}' creating a new project: ${JSON.stringify(
        createProjectDto,
      )}`,
    );
    return await this.projectService.createProject(createProjectDto, user);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  async updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: IUser,
  ): Promise<ProjectEntity> {
    return await this.projectService.updateProject(id, updateProjectDto, user);
  }

  @Delete('/:id')
  async deleteProject(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: IUser,
  ): Promise<void> {
    this.logger.verbose(
      `User '${user.email}' deleting a project with with id '${id}'`,
    );
    await this.projectService.deleteProject(id, user);
  }
}

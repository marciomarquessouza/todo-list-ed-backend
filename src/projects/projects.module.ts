import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { UserRepository } from 'src/auth/user.repository';
import { ProjectRepository } from './project.repository';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository, UserRepository])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'projects', method: RequestMethod.POST },
        { path: 'projects', method: RequestMethod.GET },
        { path: 'projects/:id', method: RequestMethod.GET },
        { path: 'projects/:id', method: RequestMethod.PUT },
        { path: 'projects/:id', method: RequestMethod.DELETE },
      );
  }
}

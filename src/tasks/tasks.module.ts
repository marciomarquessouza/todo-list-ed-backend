import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { UserRepository } from 'src/auth/user.repository';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository, UserRepository])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'tasks', method: RequestMethod.GET },
        { path: 'tasks/:id', method: RequestMethod.GET },
        { path: 'tasks', method: RequestMethod.POST },
        { path: 'tasks/:id', method: RequestMethod.PUT },
        { path: 'tasks/:id/:status', method: RequestMethod.PATCH },
        { path: 'tasks/:id', method: RequestMethod.DELETE },
      );
  }
}

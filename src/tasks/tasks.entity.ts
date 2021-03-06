import { UserEntity } from 'src/auth/user.entity';
import { ProjectEntity } from 'src/projects/projects.entity';
import {
  BaseEntity,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './tasks.interface';

@Entity('task')
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  status: TaskStatus;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'date', nullable: true })
  startedAt?: Date;

  @Column({ type: 'date', nullable: true })
  finishedAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @ManyToOne(
    type => UserEntity,
    user => user.tasks,
    { eager: false },
  )
  user: UserEntity;

  @ManyToOne(
    type => ProjectEntity,
    project => project.tasks,
    { eager: false },
  )
  project: ProjectEntity;

  @Column()
  userId: number;

  @Column()
  projectId: number;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}

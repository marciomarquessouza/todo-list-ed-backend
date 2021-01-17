import { UserEntity } from 'src/auth/user.entity';
import { TaskEntity } from 'src/tasks/tasks.entity';
import {
  BaseEntity,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('project')
export class ProjectEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @ManyToOne(
    type => UserEntity,
    user => user.projects,
    { eager: false },
  )
  user: UserEntity;

  @Column()
  userId: number;

  @OneToMany(
    type => TaskEntity,
    task => task.project,
    { eager: true },
  )
  tasks: TaskEntity[];

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }
}

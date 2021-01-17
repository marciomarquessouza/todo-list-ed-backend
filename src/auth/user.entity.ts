import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { ProjectEntity } from 'src/projects/projects.entity';
import { TaskEntity } from 'src/tasks/tasks.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('user')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(
    type => TaskEntity,
    task => task.user,
    { eager: true },
  )
  tasks: TaskEntity[];

  @OneToMany(
    type => ProjectEntity,
    project => project.user,
  )
  projects: ProjectEntity[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}

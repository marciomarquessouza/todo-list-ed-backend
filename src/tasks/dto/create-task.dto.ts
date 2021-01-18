import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  projectId: number;
}

import { IsNotEmpty } from 'class-validator';

export class UpdateProjectDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
}

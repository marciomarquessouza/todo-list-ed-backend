import { IsNotEmpty, IsOptional } from 'class-validator';

export class FilterProjectDto {
  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsNotEmpty()
  limit: number;
}

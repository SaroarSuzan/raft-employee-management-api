import { IsOptional, IsString } from 'class-validator';

export class FindEmployeesQueryDto {
  @IsOptional()
  @IsString()
  department?: string;
}
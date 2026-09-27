import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsString({ message: 'department must be a string' })
  @IsNotEmpty({ message: 'department is required' })
  department: string;

  @IsNotEmpty({ message: 'joiningDate is required' })
  @IsDateString({}, { message: 'joiningDate must be a valid date (YYYY-MM-DD)' })
  joiningDate: string;
}
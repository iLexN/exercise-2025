import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserRole } from '../enum/user.role';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsArray()
  roles: UserRole[];
}

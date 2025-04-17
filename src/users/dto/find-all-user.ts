import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllUserDto {
  name: string;

  @Transform(({ value }) => Number(value)) // Transform string to number
  @IsNumber()
  age: number;
}

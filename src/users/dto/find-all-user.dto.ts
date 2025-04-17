import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllUserDto {
  name: string;

  @IsOptional()
  @Transform(({ value }) => Number(value)) // Transform string to number
  @IsNumber()
  age: number;
}

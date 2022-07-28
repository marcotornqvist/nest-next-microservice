import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;
}

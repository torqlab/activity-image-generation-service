import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class GeneratorQueryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Prompt must not be empty' })
  prompt?: string;
}

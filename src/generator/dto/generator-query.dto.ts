import { IsString, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO for image generation query parameters.
 */
export class GeneratorQueryDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Prompt must not be empty' })
  prompt?: string;
}

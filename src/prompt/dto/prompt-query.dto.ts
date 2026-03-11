import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for prompt generation query parameters.
 */
export class PromptQueryDto {
  @IsString()
  @IsNotEmpty()
  signals?: string;
}

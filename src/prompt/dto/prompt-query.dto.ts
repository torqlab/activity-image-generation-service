import { IsString, IsNotEmpty } from 'class-validator';

export class PromptQueryDto {
  @IsString()
  @IsNotEmpty()
  signals?: string;
}

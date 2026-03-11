import { ApiProperty } from '@nestjs/swagger';

export class PromptResponseDto {
  @ApiProperty({
    description: 'Generated image generation prompt',
    example: 'A professional athlete running in morning sunlight, minimalistic style',
  })
  prompt?: string;
}

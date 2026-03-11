import { Module } from '@nestjs/common';

import { ForbiddenContentModule } from '../forbidden-content';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';

/**
 * Module for prompt generation functionality.
 */
@Module({
  imports: [ForbiddenContentModule],
  controllers: [PromptController],
  providers: [PromptService],
})
export class PromptModule {}

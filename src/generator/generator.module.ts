import { Module } from '@nestjs/common';

import { ForbiddenContentModule } from '../forbidden-content';
import { GeneratorService } from './generator.service';
import { GeneratorController } from './generator.controller';

@Module({
  imports: [ForbiddenContentModule],
  controllers: [GeneratorController],
  providers: [GeneratorService],
})
export class GeneratorModule {}

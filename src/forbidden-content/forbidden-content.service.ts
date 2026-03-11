import { Injectable } from '@nestjs/common';
import checkForbiddenContent from './check-forbidden-content';

@Injectable()
export class ForbiddenContentService {
  check(text: string): boolean {
    return checkForbiddenContent(text);
  }
}

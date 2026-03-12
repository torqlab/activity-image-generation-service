import { Injectable } from '@nestjs/common';
import checkForbiddenContent from '@torqlab/check-forbidden-content';

/**
 * Service for checking if text contains forbidden or inappropriate content.
 */
@Injectable()
export class ForbiddenContentService {
  /**
   * Checks if the provided text contains forbidden or inappropriate content.
   * @param {string} text - The text to check for forbidden content
   * @returns {boolean} True if the text contains forbidden content
   */
  check(text: string): boolean {
    return checkForbiddenContent(text);
  }
}

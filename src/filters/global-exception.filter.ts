import { Request, Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

const IGNORED_PATHS = ['/robots.txt', '/favicon.ico'];

interface ErrorResponse {
  error: string;
  message: string;
}

/**
 * Global exception filter that handles all unhandled exceptions.
 * Provides consistent error response format and logging for the entire application.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Catches and handles exceptions, returning appropriate error responses.
   * @param {unknown} exception - The exception that was thrown
   * @param {ArgumentsHost} host - The ArgumentsHost containing request/response context
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    /**
     * Determines the appropriate HTTP status code and error response based on the exception type.
     * @returns {{status: number; errorResponse: ErrorResponse}} The HTTP status and error response object
     */
    const getErrorInfo = (): { status: number; errorResponse: ErrorResponse } => {
      const defaultError: ErrorResponse = {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      };

      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
          const errorObj = exceptionResponse as Record<string, unknown>;
          return {
            status,
            errorResponse: {
              error: (errorObj.error as string) || 'Error',
              message: (errorObj.message as string) || exception.message,
            },
          };
        }
        return {
          status,
          errorResponse: {
            error: exception.name,
            message: exception.message,
          },
        };
      }

      if (exception instanceof Error) {
        return {
          status: 500,
          errorResponse: {
            error: exception.constructor.name,
            message: exception.message,
          },
        };
      }

      return { status: 500, errorResponse: defaultError };
    };

    const { status, errorResponse } = getErrorInfo();

    const request = ctx.getRequest<Request>();
    const isIgnoredPath =
      exception instanceof NotFoundException &&
      IGNORED_PATHS.some((p) => request.path.startsWith(p));

    if (!isIgnoredPath) {
      this.logger.error(
        `${errorResponse.error}: ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : ''
      );
    }

    response.status(status).json(errorResponse);
  }
}

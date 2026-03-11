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

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let errorResponse: ErrorResponse = {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const errorObj = exceptionResponse as Record<string, unknown>;

        errorResponse = {
          error: (errorObj.error as string) || 'Error',
          message: (errorObj.message as string) || exception.message,
        };
      } else {
        errorResponse = {
          error: exception.name,
          message: exception.message,
        };
      }
    } else if (exception instanceof Error) {
      errorResponse = {
        error: exception.constructor.name,
        message: exception.message,
      };
    }

    const request = ctx.getRequest<Request>();
    const isIgnoredPath =
      exception instanceof NotFoundException &&
      IGNORED_PATHS.some((p) => request.path.startsWith(p));

    if (!isIgnoredPath) {
      this.logger.error(
        `${errorResponse.error}: ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : '',
      );
    }

    response.status(status).json(errorResponse);
  }
}

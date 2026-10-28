import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() //to configure this its handle all the type of exception
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly appLogger = new Logger('GlobalExceptionHandler');

  catch(err: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // Determine HTTP status code
    const statusCode =
      err instanceof HttpException
        ? err.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract clean error message
    let errorMessage: any = 'Internal server error occurred';
    if (err instanceof HttpException) {
      const responseBody = err.getResponse();
      errorMessage =
        typeof responseBody === 'object' &&
        responseBody !== null &&
        'message' in responseBody
          ? (responseBody as Record<string, any>).message
          : err.message;
    } else if (err instanceof Error) {
      // Log unexpected crashes on the server console (without leaking to the client)
      this.appLogger.error(`Server Error: ${err.message}`, err.stack);
    }

    // Return standardized error JSON
    res.status(statusCode).json({
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.url,
      method: req.method,
      error: errorMessage,
    });
  }
}

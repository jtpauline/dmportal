import { logger } from '../logging/logger';

export interface ErrorReportOptions {
  context?: Record<string, unknown>;
  tags?: string[];
  severity?: 'error' | 'warning' | 'info';
}

export class ErrorReporter {
  private static instance: ErrorReporter;

  private constructor() {}

  public static getInstance(): ErrorReporter {
    if (!this.instance) {
      this.instance = new ErrorReporter();
    }
    return this.instance;
  }

  public captureException(
    error: Error | string, 
    options: ErrorReportOptions = {}
  ) {
    const { 
      context = {}, 
      tags = [], 
      severity = 'error' 
    } = options;

    // Log to centralized logger
    logger.log({
      level: severity === 'error' ? 'ERROR' : severity === 'warning' ? 'WARN' : 'INFO',
      message: typeof error === 'string' ? error : error.message,
      context: {
        ...context,
        tags,
        timestamp: new Date().toISOString()
      },
      error: error instanceof Error ? error : undefined
    });

    // Future: Integrate with external error tracking services
    this.reportToExternalService(error, options);
  }

  private reportToExternalService(
    error: Error | string, 
    options: ErrorReportOptions
  ) {
    // Placeholder for external error reporting 
    // Could integrate Sentry, LogRocket, etc.
    try {
      // Example mock implementation
      console.error('Error Report:', {
        error,
        ...options
      });
    } catch (reportError) {
      logger.warn('Error reporting failed', reportError);
    }
  }

  public trackPerformance(
    operationName: string, 
    startTime: number
  ) {
    const duration = Date.now() - startTime;
    
    if (duration > 1000) {  // Log performance issues over 1 second
      this.captureException(`Slow operation: ${operationName}`, {
        context: { duration },
        severity: 'warning'
      });
    }
  }
}

export const errorReporter = ErrorReporter.getInstance();

import { z } from 'zod';

// Comprehensive error tracking schema
export const ErrorSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'VALIDATION_ERROR', 
    'PERSISTENCE_ERROR', 
    'NETWORK_ERROR', 
    'RUNTIME_ERROR',
    'SECURITY_ERROR'
  ]),
  message: z.string(),
  context: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.date().default(() => new Date()),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  stackTrace: z.string().optional()
});

export class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private errors: z.infer<typeof ErrorSchema>[] = [];

  private constructor() {}

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  // Log an error with comprehensive details
  logError(
    type: z.infer<typeof ErrorSchema>['type'], 
    message: string, 
    options: Partial<z.infer<typeof ErrorSchema>> = {}
  ): void {
    const errorEntry: z.infer<typeof ErrorSchema> = {
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: new Date(),
      severity: 'MEDIUM',
      ...options
    };

    // Validate error schema
    try {
      ErrorSchema.parse(errorEntry);
    } catch (validationError) {
      console.error('Invalid error log', validationError);
      return;
    }

    // Store error
    this.errors.push(errorEntry);

    // Optional: Send to remote error tracking
    this.reportToRemoteService(errorEntry);
  }

  // Advanced error reporting mechanism
  private reportToRemoteService(error: z.infer<typeof ErrorSchema>): void {
    // Implement remote error reporting logic
    // Could integrate with services like Sentry, LogRocket, etc.
    if (navigator.onLine) {
      try {
        // Placeholder for actual error reporting
        console.log('Reporting error to remote service', error);
      } catch (reportError) {
        console.error('Error reporting failed', reportError);
      }
    }
  }

  // Retrieve recent errors
  getRecentErrors(limit: number = 10): z.infer<typeof ErrorSchema>[] {
    return this.errors.slice(-limit);
  }

  // Clear error log
  clearErrorLog(): void {
    this.errors = [];
  }
}

// Singleton error tracking service
export const errorTracker = ErrorTrackingService.getInstance();

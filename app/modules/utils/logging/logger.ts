import { ValidationError } from '../validation/validation-types';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

export class Logger {
  private static instance: Logger;
  private logEntries: LogEntry[] = [];
  private currentLogLevel: LogLevel = LogLevel.INFO;

  private constructor() {}

  public static getInstance(): Logger {
    if (!this.instance) {
      this.instance = new Logger();
    }
    return this.instance;
  }

  public setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
  }

  public log(entry: Omit<LogEntry, 'timestamp'>): void {
    const logEntry: LogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    // Console logging
    this.consoleLog(logEntry);

    // Store log entry
    this.logEntries.push(logEntry);

    // Optional: Persist logs (could be extended to file/remote logging)
    this.persistLogs(logEntry);
  }

  public error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log({
      level: LogLevel.ERROR,
      message,
      error,
      context
    });
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.log({
      level: LogLevel.WARN,
      message,
      context
    });
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log({
      level: LogLevel.INFO,
      message,
      context
    });
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    if (this.currentLogLevel === LogLevel.DEBUG) {
      this.log({
        level: LogLevel.DEBUG,
        message,
        context
      });
    }
  }

  private consoleLog(entry: LogEntry): void {
    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(`[${entry.timestamp}] ${entry.message}`, entry.context, entry.error);
        break;
      case LogLevel.WARN:
        console.warn(`[${entry.timestamp}] ${entry.message}`, entry.context);
        break;
      case LogLevel.INFO:
        console.info(`[${entry.timestamp}] ${entry.message}`, entry.context);
        break;
      case LogLevel.DEBUG:
        console.debug(`[${entry.timestamp}] ${entry.message}`, entry.context);
        break;
    }
  }

  private persistLogs(entry: LogEntry): void {
    // Future implementation for persistent logging
    // Could involve writing to file, sending to logging service, etc.
  }

  public getLogs(level?: LogLevel): LogEntry[] {
    return level 
      ? this.logEntries.filter(entry => entry.level === level)
      : this.logEntries;
  }
}

// Global logger instance
export const logger = Logger.getInstance();

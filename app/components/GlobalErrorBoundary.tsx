import React from 'react';
import { logger } from '~/modules/utils/logging/logger';
import { LogLevel } from '~/modules/utils/logging/logger';

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error using our centralized logger
    logger.error('Unhandled Error in React Component', error, {
      componentStack: errorInfo.componentStack,
      errorName: error.name,
      errorMessage: error.message
    });

    // Optional: Send error to monitoring service
    this.reportErrorToMonitoringService(error, errorInfo);
  }

  reportErrorToMonitoringService(error: Error, errorInfo: React.ErrorInfo) {
    // Placeholder for error reporting service integration
    // Could be Sentry, LogRocket, or custom error tracking
    try {
      // Example: Custom error reporting
      fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack
        })
      }).catch(reportError => {
        logger.warn('Failed to report error', reportError);
      });
    } catch (reportError) {
      logger.warn('Error reporting failed', reportError);
    }
  }

  handleErrorRecovery = () => {
    this.setState({ hasError: false, error: undefined });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or provided fallback
      return this.props.fallbackComponent || (
        <div className="error-fallback">
          <h1>Something went wrong</h1>
          <p>We're sorry for the inconvenience.</p>
          <button onClick={this.handleErrorRecovery}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;

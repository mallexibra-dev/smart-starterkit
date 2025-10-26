import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error service (optional)
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In production, you might want to send this to a logging service
    // Like Sentry, LogRocket, or your own backend
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, {
      //   extra: errorInfo,
      // });
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Oops! Something went wrong
                </CardTitle>
                <CardDescription className="mt-2">
                  We're sorry, but something unexpected happened.
                  The error has been logged and we'll look into it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Error details in development */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error Details</AlertTitle>
                    <AlertDescription className="mt-2">
                      <div className="text-sm">
                        <p className="font-mono mb-2">{this.state.error.message}</p>
                        {this.state.errorInfo && (
                          <details className="mt-2">
                            <summary className="cursor-pointer font-semibold">
                              Component Stack
                            </summary>
                            <pre className="mt-2 text-xs overflow-auto bg-gray-100 p-2 rounded">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </details>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2">
                  <Button onClick={this.handleRetry} variant="outline" className="flex-1">
                    Try Again
                  </Button>
                  <Button onClick={this.handleReload} className="flex-1">
                    Reload Page
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>If the problem persists, please contact support.</p>
                  <p className="mt-1">
                    Error ID: {Date.now().toString(36)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo);

    // Log to service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
    }
  };
};
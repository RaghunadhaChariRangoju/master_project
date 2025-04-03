import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className="w-full max-w-md mx-auto mt-10 border-rose-200">
          <CardHeader className="bg-rose-50 text-rose-700">
            <div className="flex items-center gap-2">
              <AlertTriangle />
              <CardTitle>Something went wrong</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-muted-foreground">
              An error occurred while rendering this component. We apologize for the inconvenience.
            </p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Error Details:</p>
                <pre className="bg-slate-100 p-4 rounded text-sm overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-slate-50">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go to Homepage
            </Button>
            <Button onClick={this.resetError}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

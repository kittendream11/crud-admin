'use client';

import React, { ReactNode, ReactElement } from 'react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Here you could send error to logging service (Sentry, etc.)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="primary" onClick={this.resetError}>
                  Try again
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Go to dashboard
                </Button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

import { AlertTriangle, RefreshCw } from '@tamagui/lucide-icons';
import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { YStack, XStack, Heading, Text, Button } from 'tamagui';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    // Log error to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset?: () => void;
  title?: string;
  message?: string;
}

export function ErrorFallback({
  error,
  onReset,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
}: ErrorFallbackProps) {
  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$6"
      backgroundColor="$background"
      gap="$4"
    >
      <YStack
        backgroundColor="$red2"
        padding="$4"
        borderRadius="$4"
        alignItems="center"
        maxWidth={400}
        gap="$4"
      >
        <XStack
          backgroundColor="$red5"
          padding="$3"
          borderRadius={50}
        >
          <AlertTriangle size={32} color="$red10" />
        </XStack>

        <YStack alignItems="center" gap="$2">
          <Heading size="$6" textAlign="center">
            {title}
          </Heading>
          <Text color="$gray11" textAlign="center">
            {message}
          </Text>
        </YStack>

        {__DEV__ && error && (
          <YStack
            backgroundColor="$gray3"
            padding="$3"
            borderRadius="$2"
            width="100%"
          >
            <Text fontSize="$2" fontFamily="$mono" color="$red10">
              {error.message}
            </Text>
          </YStack>
        )}

        {onReset && (
          <Button
            variant="primary"
            icon={<RefreshCw size={18} />}
            onPress={onReset}
          >
            Try Again
          </Button>
        )}
      </YStack>
    </YStack>
  );
}

// Global __DEV__ for React Native compatibility
declare global {
  const __DEV__: boolean;
}

// Define __DEV__ for web if not defined
if (typeof __DEV__ === 'undefined') {
  (globalThis as { __DEV__: boolean }).__DEV__ = process.env.NODE_ENV !== 'production';
}

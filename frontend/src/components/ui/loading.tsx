// src/components/ui/loading.tsx
import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  message = 'Loading...',
  fullPage = false,
}) => {
  // Determine spinner size
  const spinnerSizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  const spinnerSize = spinnerSizes[size];

  // Basic spinner component
  const Spinner = () => (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${spinnerSize}`}
    ></div>
  );

  // For full page loading
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
        <div className="flex flex-col items-center p-4 space-y-4">
          <Spinner />
          {message && <p className="text-muted-foreground">{message}</p>}
        </div>
      </div>
    );
  }

  // Regular inline loading indicator
  return (
    <div className="flex items-center space-x-2">
      <Spinner />
      {message && <p className="text-muted-foreground">{message}</p>}
    </div>
  );
};

// HOC for wrapping components with loading state
export function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  loadingProps?: LoadingProps
) {
  return function WithLoadingComponent({
    isLoading,
    ...props
  }: P & { isLoading: boolean }) {
    if (isLoading) {
      return <Loading {...loadingProps} />;
    }

    return <Component {...(props as P)} />;
  };
}

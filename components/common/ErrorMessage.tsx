import React from 'react';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg text-center ${className}`}>
      <p className="text-red-700 dark:text-red-300 font-medium mb-4">{message}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Tentar Novamente
        </Button>
      )}
    </div>
  );
};

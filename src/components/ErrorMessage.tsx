import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 flex items-start">
      <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={18} />
      <span>{message}</span>
    </div>
  );
};
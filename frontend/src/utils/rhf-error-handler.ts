import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';



import axios from 'axios';

export const capitalizeFirst = (msg: string) =>
  msg ? msg.charAt(0).toUpperCase() + msg.slice(1) : '';

// Utility to recursively format errors (same logic as your formatErrorMessages)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatErrorMessages = (errorData: Record<string, any>): Record<string, string> => {
  const formatted: Record<string, string> = {};

  for (const key in errorData) {
    const value = errorData[key];

    if (typeof value === 'string') {
      formatted[key] = capitalizeFirst(value);
    } else if (Array.isArray(value) && typeof value[0] === 'string') {
      formatted[key] = capitalizeFirst(value[0]);
    } else if (typeof value === 'object' && value !== null) {
      const nestedErrors = formatErrorMessages(value);
      for (const nestedKey in nestedErrors) {
        formatted[`${key}.${nestedKey}`] = nestedErrors[nestedKey];
      }
    }
  }

  return formatted;
};

export const handleRHFAxiosError = <TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  fallback?: () => void
) => {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data;
    console.log('Error Data', errorData);

    if (errorData && typeof errorData === 'object') {
      const formattedErrors = formatErrorMessages(errorData);
      for (const [key, message] of Object.entries(formattedErrors)) {
        setError(key as Path<TFieldValues>, { type: 'manual', message });
      }
      return;
    }
  }

  fallback?.();
};

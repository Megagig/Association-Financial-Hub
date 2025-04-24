import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message?: string;
  errors?: {
    [key: string]: string[];
  };
}

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.message) {
      return data.message;
    }

    if (data?.errors) {
      // Flatten validation errors into a single message
      const errorMessages = Object.entries(data.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');

      return errorMessages || 'Validation failed';
    }

    if (error.response?.status === 401) {
      return 'Authentication required. Please login again.';
    }

    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }

    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }

    if (error.response?.status === 500) {
      return 'A server error occurred. Please try again later.';
    }

    return error.message || 'An error occurred with your request';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}

import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { ERROR_MESSAGES } from './constants';
import { IS_DEMO } from './constants';

interface ErrorResponse {
  message?: string;
  error?: string;
  code?: string;
  validation?: Record<string, string[]>;
}

export function handleError(error: unknown, defaultMessage = ERROR_MESSAGES.DEFAULT): void {
  console.error('Error:', error);

  // If in demo mode, show a different message
  if (IS_DEMO) {
    toast.error('Erro ao processar dados simulados. Por favor, tente novamente.');
    return;
  }

  if (isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse | undefined;
    const status = error.response?.status;

    // Handle specific HTTP status codes
    switch (status) {
      case 401:
        toast.error(ERROR_MESSAGES.UNAUTHORIZED);
        // Optionally redirect to login
        return;
      case 404:
        toast.error(ERROR_MESSAGES.NOT_FOUND);
        return;
      case 422:
        if (data?.validation) {
          // Handle validation errors
          Object.values(data.validation).flat().forEach(message => {
            toast.error(message);
          });
          return;
        }
        break;
      case 500:
        toast.error(ERROR_MESSAGES.SERVER);
        return;
    }

    // Handle network errors
    if (!error.response) {
      toast.error(ERROR_MESSAGES.NETWORK);
      return;
    }

    // Handle other errors with custom messages
    const message = data?.message || data?.error || error.message;
    toast.error(message || defaultMessage);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message || defaultMessage);
    return;
  }

  toast.error(defaultMessage);
}
import { useToast } from './use-toast';

interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

export const useApiErrorToast = () => {
  const { toast } = useToast();

  const showApiError = (error: unknown, defaultTitle = "Operation failed") => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let title = defaultTitle;

    // Extract message from error object safely
    const maybeMsg = (error && typeof (error as { message?: unknown }).message === 'string')
      ? (error as { message: string }).message
      : '';

    if (maybeMsg) {
      errorMessage = maybeMsg;

      // Provide clearer guidance for common problems
      const lower = errorMessage.toLowerCase();
      if (lower.includes('unable to connect') || lower.includes('connection refused') || lower.includes('failed to fetch')) {
        errorMessage += ' Please ensure the backend server is running at https://localhost:7197 and that CORS is enabled.';
        title = "Connection Error";
      } else if (lower.includes('invalid') && (lower.includes('password') || lower.includes('email') || lower.includes('credentials') || lower.includes('incorrect'))) {
        errorMessage = 'Incorrect email or password. Please check your credentials and try again.';
        title = "Authentication Failed";
      } else if (lower.includes('lock') || lower.includes('suspended') || lower.includes('disabled')) {
        title = "Account Issue";
      } else if (lower.includes('validation')) {
        title = "Validation Error";
      } else if (lower.includes('token expired') || lower.includes('authentication')) {
        title = "Session Expired";
      }
    }

    toast({
      title,
      description: errorMessage,
      variant: "destructive",
    });
  };

  return { showApiError };
};
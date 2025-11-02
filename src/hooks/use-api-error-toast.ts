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
      const lower = maybeMsg.toLowerCase();
      
      // Provide clearer guidance for common problems
      if (lower.includes('unable to connect') || lower.includes('connection refused') || lower.includes('failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection or contact support.';
        title = "Connection Error";
      } else if (lower.includes('invalid email or password') || lower.includes('invalid credentials')) {
        errorMessage = 'The email or password you entered is incorrect. Please check your credentials and try again.';
        title = "Login Failed";
      } else if (lower.includes('email not confirmed') || lower.includes('confirm your email')) {
        errorMessage = 'Please check your email and set up your password before logging in. If you haven\'t received an email, contact your administrator.';
        title = "Email Not Confirmed";
      } else if (lower.includes('account') && (lower.includes('lock') || lower.includes('suspended') || lower.includes('disabled'))) {
        errorMessage = 'Your account has been suspended or locked. Please contact support for assistance.';
        title = "Account Restricted";
      } else if (lower.includes('password') && (lower.includes('expired') || lower.includes('must change'))) {
        errorMessage = 'Your password has expired and must be changed. You will be redirected to reset your password.';
        title = "Password Change Required";
      } else if (lower.includes('token expired') || lower.includes('session expired')) {
        errorMessage = 'Your session has expired. Please log in again.';
        title = "Session Expired";
      } else if (lower.includes('validation') || lower.includes('required')) {
        errorMessage = maybeMsg; // Show the specific validation error
        title = "Validation Error";
      } else if (lower.includes('unauthorized') || lower.includes('403') || lower.includes('401')) {
        errorMessage = 'You don\'t have permission to perform this action. Please check your credentials or contact support.';
        title = "Access Denied";
      } else if (lower.includes('server error') || lower.includes('500')) {
        errorMessage = 'A server error occurred. Please try again later or contact support if the problem persists.';
        title = "Server Error";
      } else {
        // Use the original error message but make it more user-friendly
        errorMessage = maybeMsg;
        
        // Make common technical errors more user-friendly
        if (lower.includes('cors')) {
          errorMessage = 'There was a connection issue with the server. Please contact support.';
          title = "Connection Issue";
        }
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
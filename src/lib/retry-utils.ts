interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  shouldRetry: () => true,
  onRetry: () => {}
};

async function cloneResponse(response: Response): Promise<Response> {
  const clonedResponse = response.clone();
  const body = await response.text();
  return new Response(body, {
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
    headers: clonedResponse.headers
  });
}
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay, shouldRetry, onRetry } = { ...defaultOptions, ...options };
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fn();
      if (response instanceof Response) {
        return await cloneResponse(response);
      }
      return await fn();
    } catch (error) {
      lastError = error;
      
      const isLastAttempt = attempt === maxRetries - 1;
      if (!shouldRetry(error) || isLastAttempt) {
        throw error;
      }

      // Calculate exponential backoff with jitter and max delay
      const exponentialDelay = baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 1000;
      const delay = Math.min(exponentialDelay + jitter, maxDelay);
      
      onRetry(attempt + 1, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
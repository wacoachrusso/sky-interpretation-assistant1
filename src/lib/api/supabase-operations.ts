import { retryWithBackoff } from '@/lib/retry-utils'
import { isRetryableError } from '@/lib/errors'

interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}
const RETRY_OPTIONS = {
  maxRetries: 3,
  baseDelay: 1000,
  shouldRetry: isRetryableError,
  onRetry: (attempt: number, error: any) => {
    console.warn(`Retry attempt ${attempt}/${RETRY_OPTIONS.maxRetries}`)
  }
}
async function handleSupabaseResponse<T>(response: SupabaseResponse<T>): Promise<T> {
  if (response.error) throw response.error;
  if (!response.data) throw new Error('No data returned');
  return response.data;
}

export async function executeSupabaseQuery<T>(
  operation: () => Promise<SupabaseResponse<T>>,
  options = RETRY_OPTIONS
): Promise<T> {
  return retryWithBackoff(async () => {
    const { data, error } = await operation()
    return handleSupabaseResponse({ data, error })
  }, options)
}

export async function executeSupabaseOperation<T>(
  operation: () => Promise<T>,
  options = RETRY_OPTIONS
): Promise<T> {
  return retryWithBackoff(operation, options)
}

export async function executeSupabaseTransaction<T>(
  operations: Array<() => Promise<T>>,
  options = RETRY_OPTIONS
): Promise<T[]> {
  return retryWithBackoff(async () => {
    const results: T[] = []
    for (const operation of operations) {
      const result = await executeSupabaseOperation(operation, options)
      results.push(result)
    }
    return results
  }, options)
}
import { createError } from '../types/errors';

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

export const withNetworkCheck = async <T>(
  operation: () => Promise<T>,
  options: { timeout?: number; retryCount?: number } = {}
): Promise<T> => {
  const { retryCount = 1 } = options;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === retryCount) {
        throw createError(error);
      }
      await sleep(1000);
    }
  }

  throw createError(new Error('Unknown network failure'));
};

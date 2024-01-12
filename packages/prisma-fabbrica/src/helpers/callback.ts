export type CallbackFn<T extends any[]> = (...args: T) => unknown;

export function createCallbackChain<T extends any[]>(callbackFns: readonly (CallbackFn<T> | undefined)[]) {
  return async (...args: T) => {
    await callbackFns.reduce(async (acc, fn) => {
      await acc;
      if (!fn) return;
      await fn(...args);
    }, Promise.resolve());
  };
}

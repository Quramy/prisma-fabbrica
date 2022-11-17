export type Resolver<T extends Record<string, unknown>> = T | (() => T) | (() => PromiseLike<T>);

export async function resolveValue<T extends Record<string, unknown>>(resolver: Resolver<T>) {
  const fn = typeof resolver === "function" ? resolver : () => Promise.resolve(resolver);
  return (await fn()) as T;
}

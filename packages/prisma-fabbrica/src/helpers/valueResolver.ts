export type Resolver<T extends Record<string, unknown>, S extends Record<string, unknown>> =
  | T
  | ((opt: S) => T)
  | ((opt: S) => PromiseLike<T>);

export function normalizeResolver<T extends Record<string, unknown>, S extends Record<string, unknown>>(
  resolver: Resolver<T, S>,
): (opt: S) => Promise<T> {
  return async (opt: S) => {
    const fn = typeof resolver === "function" ? resolver : () => Promise.resolve(resolver);
    return (await fn(opt)) as T;
  };
}

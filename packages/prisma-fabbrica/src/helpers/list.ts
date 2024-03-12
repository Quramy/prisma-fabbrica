export function normalizeList<T extends Record<string, unknown>>(input: number | readonly T[]) {
  if (typeof input === "number") {
    return [...new Array(input).keys()].map(() => ({}) as T);
  } else {
    return input;
  }
}

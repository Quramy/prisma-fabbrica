export function normalizeList<T extends Record<string, unknown>>(...args: any[]): T[] {
  const [countOrList, item = {}] = args;
  if (typeof countOrList === "number") {
    return [...new Array(countOrList).keys()].map(() => item) as T[];
  } else if (Array.isArray(countOrList)) {
    return countOrList as T[];
  } else {
    throw new Error("Illegal Argument");
  }
}

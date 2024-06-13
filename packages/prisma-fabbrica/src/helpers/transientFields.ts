export function synthesize<T extends Record<string, unknown>, S extends Record<string, unknown> | null | undefined>(
  defaultValues: T,
  inputData: S,
) {
  const merged = { ...defaultValues } as any;
  if (!inputData) return merged as T;
  for (const key of Object.keys(defaultValues)) {
    if (inputData[key] != null) {
      merged[key] = inputData[key];
    }
  }
  return merged as T;
}

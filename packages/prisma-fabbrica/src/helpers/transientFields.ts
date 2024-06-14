export function destructure<T extends Record<string, unknown>, S extends Record<string, unknown>>(
  defaultValues: T,
  inputData: S | null | undefined,
) {
  const merged = { ...defaultValues } as any;
  const filteredInputData = (inputData ?? {}) as S;
  for (const key of Object.keys(defaultValues)) {
    if (filteredInputData[key] != null) {
      merged[key] = filteredInputData[key];
      delete filteredInputData[key];
    }
  }
  return [merged, filteredInputData] as [T, S];
}

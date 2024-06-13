import { synthesize } from "./transientFields";

describe(synthesize, () => {
  const defaultValues = {
    a: 1,
  };

  test.each([
    { inputData: undefined, expected: [{ a: 1 }, {}] },
    { inputData: null, expected: [{ a: 1 }, {}] },
    { inputData: {}, expected: [{ a: 1 }, {}] },
    { inputData: { a: 2 }, expected: [{ a: 2 }, {}] },
    { inputData: { b: 1 }, expected: [{ a: 1 }, { b: 1 }] },
  ])("works with $inputData", ({ inputData, expected }) => {
    expect(synthesize(defaultValues, inputData)).toEqual(expected);
  });
});

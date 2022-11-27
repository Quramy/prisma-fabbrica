import { Resolver, normalizeResolver } from "./valueResolver";

type TestResolver = Resolver<{ value: string }, { seq: number }>;

describe(normalizeResolver, () => {
  test("with plain object", async () => {
    const r: TestResolver = {
      value: "hoge",
    };
    const resolver = normalizeResolver<{ value: string }, { seq: number }>(r);
    await expect(resolver({ seq: 1 })).resolves.toEqual({ value: "hoge" });
  });

  test("with sync function", async () => {
    const r: TestResolver = ({ seq }) => ({
      value: `${seq}`,
    });
    const resolver = normalizeResolver<{ value: string }, { seq: number }>(r);
    await expect(resolver({ seq: 1 })).resolves.toEqual({ value: "1" });
  });

  test("with async function", async () => {
    const r: TestResolver = async ({ seq }) => ({
      value: `${await seq}`,
    });
    const resolver = normalizeResolver<{ value: string }, { seq: number }>(r);
    await expect(resolver({ seq: 1 })).resolves.toEqual({ value: "1" });
  });
});

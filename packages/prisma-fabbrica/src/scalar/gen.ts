import short from "short-uuid";
import { StrictScalarFieldValueGenerator } from "./types";

export const scalarFieldValueGenerator: StrictScalarFieldValueGenerator = {
  Boolean: () => true,
  String: ({ fieldName, isId, isUnique }) => {
    if (isId || isUnique) {
      return short.generate();
    }
    return `${fieldName} field`;
  },
  Int: ({ isId, isUnique, seq }) => {
    if (isId || isUnique) {
      return seq;
    }
    return 10;
  },
  Float: () => 3.14,
  BigInt: () => BigInt(12_345_678),
  Decimal: () => {
    throw new Error("Not support Decimal field generation");
  },
  DateTime: () => new Date(),
  Bytes: () => Buffer.from([0x80, 0xff]),
  Json: () => ({
    key: "value",
  }),
};

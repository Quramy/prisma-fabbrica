export type ScalarFieldGenerateOptions = {
  readonly modelName: string;
  readonly fieldName: string;
  readonly isUnique: boolean;
  readonly isId: boolean;
};

export interface ScalarFieldValueGenerator {
  Boolean: (options: ScalarFieldGenerateOptions) => boolean;
  String: (options: ScalarFieldGenerateOptions) => string;
  Int: (options: ScalarFieldGenerateOptions) => number;
  Float: (options: ScalarFieldGenerateOptions) => number;
  BigInt: (options: ScalarFieldGenerateOptions) => bigint;
  Decimal: (options: ScalarFieldGenerateOptions) => unknown;
  DateTime: (options: ScalarFieldGenerateOptions) => Date;
  Bytes: (options: ScalarFieldGenerateOptions) => Buffer;
  JSON: (options: ScalarFieldGenerateOptions) => any;
}

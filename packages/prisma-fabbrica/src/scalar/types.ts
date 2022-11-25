export type ScalarFieldGenerateOptions = {
  readonly modelName: string;
  readonly fieldName: string;
  readonly isUnique: boolean;
  readonly isId: boolean;
  readonly seq: number;
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
  Json: (options: ScalarFieldGenerateOptions) => any;
}

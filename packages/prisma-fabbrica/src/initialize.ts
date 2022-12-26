import { resetClient, setClient, PrismaClientLike } from "./clientHolder";
import { resetSequence } from "./helpers";
import { resetScalarFieldValueGenerator } from "./internal";
export { resetSequence } from "./helpers";
export { registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "./scalar/customize";

export type InitializeOptions = {
  readonly prisma: PrismaClientLike | (() => PrismaClientLike);
};

export function reset() {
  resetClient();
  resetSequence();
  resetScalarFieldValueGenerator();
}

export function initialize(options: InitializeOptions) {
  setClient(options.prisma);
  resetSequence();
}

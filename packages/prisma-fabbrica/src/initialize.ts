import { resetClient, setClient, PrismaClientLike } from "./clientHolder";
import { resetSequence } from "./helpers";
export { resetSequence } from "./helpers";

export type InitializeOptions = {
  readonly prisma: PrismaClientLike | (() => PrismaClientLike);
};

export function reset() {
  resetClient();
  resetSequence();
}

export function initialize(options: InitializeOptions) {
  setClient(options.prisma);
  resetSequence();
}

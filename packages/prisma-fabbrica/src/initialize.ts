import { resetClient, setClient, PrismaClientLike } from "./clientHolder";

export type InitializeOptions = {
  readonly prisma: PrismaClientLike | (() => PrismaClientLike);
};

export function reset() {
  resetClient();
}

export function initialize(options: InitializeOptions) {
  setClient(options.prisma);
}

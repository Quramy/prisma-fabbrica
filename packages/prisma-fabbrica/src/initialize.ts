import { setClient, PrismaClientLike } from "./clientHolder";

export type InitializeOptions = {
  readonly client: PrismaClientLike | (() => PrismaClientLike);
};

export function initialize(options: InitializeOptions) {
  setClient(options.client);
}

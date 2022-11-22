import { setClient, PrismaClientLike } from "./clientHolder";

export type InitializeOptions = {
  readonly client: () => PrismaClientLike;
};

export function initialize(options: InitializeOptions) {
  setClient(options.client);
}

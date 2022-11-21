import { setClient, PrismaClientLike } from "./clientHolder";

export type SetupOptions = {
  readonly client: () => PrismaClientLike;
};

export function setup(options: SetupOptions) {
  setClient(options.client);
}

import type { PrismaClient } from "@prisma/client";

import { setClient } from "./clientHolder";

export type SetupOptions = {
  readonly client: () => PrismaClient;
};

export function setup(options: SetupOptions) {
  setClient(options.client);
}

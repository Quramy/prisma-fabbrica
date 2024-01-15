import { resetClient, getClient as getClientDelegate, setClient, PrismaClientLike } from "./clientHolder";
import { resetSequence } from "./helpers";
import { resetScalarFieldValueGenerator } from "./internal";
export { resetSequence } from "./helpers";
export { registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "./scalar/customize";

export type InitializeOptions = {
  readonly prisma: PrismaClientLike | (() => PrismaClientLike);
};

/**
 *
 * Create functions to initialize PrismaClient instance.
 *
 * This function creates "separated" initializer.
 *
 * ```ts
 * // fabbrica_a.ts
 * import { createInitializer } from "prisma-fabbrica/lib/internal";
 *
 * const initializer = createInitializer();
 * const { getClient } = initializer;
 * export const { initialize } = initializer;
 * ```
 *
 * The above `initialize` function does not affect other fabbrica files.
 *
 */
export function createInitializer() {
  const initializerKey = Symbol("scope:createInitializer");

  const initialize = (options: InitializeOptions) => {
    setClient(options.prisma, initializerKey);
    resetSequence();
  };

  const getClient = <T extends PrismaClientLike>() => {
    return getClientDelegate<T>(initializerKey);
  };

  const reset = () => {
    resetClient(initializerKey);
    resetSequence();
    resetScalarFieldValueGenerator();
  };

  return {
    initialize,
    reset,
    getClient,
  };
}

// NOTE:
//
// This static initialize and reset functions are exported only for scripts/jest-prisma/setup.ts
export function initialize(options: InitializeOptions) {
  setClient(options.prisma);
  resetSequence();
}

export function reset() {
  resetClient();
  resetSequence();
  resetScalarFieldValueGenerator();
}

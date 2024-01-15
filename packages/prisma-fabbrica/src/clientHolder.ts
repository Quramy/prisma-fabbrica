export type PrismaClientLike = {
  $connect: () => PromiseLike<unknown>;
  $disconnect: () => PromiseLike<unknown>;
};

const DEFAULT_CLIENT_MAP_KEY = Symbol("scope:singleton");
const clientMap: Map<unknown, () => PrismaClientLike> = new Map();

export function resetClient(key: unknown = DEFAULT_CLIENT_MAP_KEY) {
  clientMap.delete(key);
}

export function setClient<T extends PrismaClientLike>(client: T | (() => T), key: unknown = DEFAULT_CLIENT_MAP_KEY) {
  const value = typeof client === "function" ? client : () => client;
  clientMap.set(key, value);
}

export function getClient<T extends PrismaClientLike>(key?: unknown) {
  const client = (clientMap.get(key) ?? clientMap.get(DEFAULT_CLIENT_MAP_KEY))?.();
  if (!client) {
    throw new Error("No prisma client");
  }
  return client as T;
}

export type PrismaClientLike = {
  $connect: () => PromiseLike<unknown>;
  $disconnect: () => PromiseLike<unknown>;
};

let _client: undefined | (() => PrismaClientLike);

export function resetClient() {
  _client = undefined;
}

export function setClient<T extends PrismaClientLike>(client: T | (() => T)) {
  _client = typeof client === "function" ? client : () => client;
}

export function getClient<T extends PrismaClientLike>() {
  const client = _client?.();
  if (!client) {
    throw new Error("No prisma client");
  }
  return client as T;
}

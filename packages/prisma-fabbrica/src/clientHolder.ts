export type PrismaClientLike = {
  $connect: () => PromiseLike<unknown>;
  $disconnect: () => PromiseLike<unknown>;
};

let _client: () => PrismaClientLike;

export function setClient<T extends PrismaClientLike>(client: () => T) {
  _client = client;
}

export function getClient<T extends PrismaClientLike>() {
  const client = _client?.();
  if (!client) {
    throw new Error("No prisma client");
  }
  return client as T;
}

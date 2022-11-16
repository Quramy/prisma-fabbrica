import type { PrismaClient } from "@prisma/client";

let _client: () => PrismaClient;

export function setClient(client: () => PrismaClient) {
  _client = client;
}

export function getClient() {
  const client = _client?.();
  if (!client) {
    throw new Error("No prisma client");
  }
  return client;
}

import type { PrismaClient } from "@prisma/client";

let _client: PrismaClient;

export function setClient(client: PrismaClient) {
  _client = client;
}

export function getClient() {
  if (!_client) {
    throw new Error("No prisma client");
  }
  return _client;
}

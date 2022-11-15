import { v4 as uuid } from "uuid";

import type { PrismaClient } from "@prisma/client";

export class UserService {
  constructor(readonly prisma: PrismaClient) {}

  async addUser(userName: string) {
    const createdUser = await this.prisma.user.create({
      data: {
        id: uuid(),
        name: userName,
      },
    });
    return createdUser;
  }
}

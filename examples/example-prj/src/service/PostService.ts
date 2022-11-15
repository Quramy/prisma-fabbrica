import type { PrismaClient } from "@prisma/client";

export class PostService {
  constructor(readonly prisma: PrismaClient) {}

  async getPosts() {
    const result = await this.prisma.post.findMany({
      take: 3,
    });
    return result;
  }
}

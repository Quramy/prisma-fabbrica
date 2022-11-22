import { PrismaClient } from "@prisma/client";

import { initialize, defineUserFactory } from "./__generated__/fabbrica";

const prisma = new PrismaClient();
initialize({ client: prisma });

async function seed() {
  const UserFactory = defineUserFactory();

  await UserFactory.create();
  await UserFactory.create({ name: "Alice" });
  await UserFactory.create({ id: "user002", name: "Bob" });

  console.log(await prisma.user.count()); // 3
}

seed();

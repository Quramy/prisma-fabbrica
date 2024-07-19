import { PrismaClient } from "@prisma/client";

import { initialize, defineUserFactory } from "../../fixtures/simple-model/__generated__/fabbrica";

const prisma = new PrismaClient();
initialize({ prisma });

async function seed() {
  const UserFactory = defineUserFactory();

  await UserFactory.create();
  await UserFactory.create({ name: "Alice" });
  await UserFactory.create({ id: "user002", name: "Bob" });

  console.log(await prisma.user.count()); // 3
}

seed();

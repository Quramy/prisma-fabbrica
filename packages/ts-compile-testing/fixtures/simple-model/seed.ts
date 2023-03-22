import { PrismaClient } from "@prisma/client";

import { initialize, defineUserFactory } from "./__generated__/fabbrica";

const prisma = new PrismaClient();
initialize({ prisma });

async function seed() {
  const UserFactory = defineUserFactory({
    defaultData: {},
    traits: {
      withdrawal: {
        data: async () => ({
          name: "***",
        }),
      },
    },
  });

  await UserFactory.create();
  await UserFactory.create({ name: "Alice" });
  await UserFactory.create({ id: "user002", name: "Bob" });

  await UserFactory.traits("withdrawal").build();

  console.log(await prisma.user.count()); // 3
}

seed();

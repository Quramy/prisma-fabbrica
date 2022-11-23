# prisma-fabbrica

Factory helper for Prisma.

## Getting started

```sh
npm i @quramy/prisma-fabbrica --dev
```

Then, edit your `prisma/schema.prisma` and append the prisma-fabbrica generator configuration:

```graphql
generator client {
  provider = "prisma-client-js"
}

generator fabbrica {
  provider = "prisma-fabbrica"
}
```

And run generate command.

```sh
npx prisma generate
```

The above command generates JavaScript and TypeScript type definition files under `src/__generated__/fabbrica` directory. You can define your model factory importing them.

For example, if `schema.prisma` has the following `User` model, you can import `defineUserFactory` and define `UserFactory` using this function.

```graphql
model User {
  id    String @id
  name  String
  posts Post[]
}
```

```ts
/* src/seed.ts */

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
```

Note: The factories uses Prisma client instance passed by `initialize` function.

## Usage of factories

### Field default values

Factory by defined with `defineUserFactory` automatically fills scalar fields.

For example, the following `User` model has some required field, `id`, `email`, `firstName` and `lastName` .

```graphql
model User {
  id          Int @id
  email       String @unique
  firstName   String
  lastName    String
  middleName  String?
  createdAt   DateTime @default(now())
}
```

```ts
const UserFactory = defineUserFactory();

await UserFactory.create(); // Insert record with auto filled id, email, firstName and lastName values
```

See https://github.com/Quramy/prisma-fabbrica/blob/main/packages/prisma-fabbrica/src/scalar/gen.ts if you want auto filling rule details.

Note: prisma-fabbrica auto filling does not affect fields with `@default()` function.

Default filling rule also can be overwritten.

```ts
const UserFactory = defineUserFactory({
  defaultData: async () => {
    email: await generateRandomEmailAddress(),
  }
})

await UserFactory.create()
```

## Tips

### Works with jest-prisma

If you use [@quramy/jest-prisma](https://github.com/Quramy/jest-prisma) or [@quramy/jest-prisma-node](https://github.com/Quramy/jest-prisma/packages/jest-prisma-node), you can pass `@quramy/prisma-fabbrica/scripts/jest-prisma` to `setupFilesAfterEnv` in your Jest configuration file.

```js
/* jset.config.mjs */

export default {
  preset: "ts-jest",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: "@quramy/jest-prisma/environment",
  setupFilesAfterEnv: ["@quramy/prisma-fabbrica/scripts/jest-prisma"],
};
```

This script calls prisma-fabbrica's `initialize` function and configures Prisma client used from each factory to integrate to join to transaction managed by jest-prisma.

## License

MIT

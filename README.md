# prisma-fabbrica

[![github actions](https://github.com/Quramy/prisma-fabbrica/workflows/build/badge.svg)](https://github.com/Quramy/talt/actions)
[![npm version](https://badge.fury.io/js/@quramy%2Fprisma-fabbrica.svg)](https://badge.fury.io/js/@quramy%2Fprisma-fabbrica)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Quramy/prisma-fabbrica/main/LICENSE)

Prisma generator for model factories.

## ToC

<!-- toc -->

- [Getting started](#getting-started)
- [Usage of factories](#usage-of-factories)
  - [Field default values](#field-default-values)
  - [Use sequence for scalar fields](#use-sequence-for-scalar-fields)
  - [Shorthand for create list](#shorthand-for-create-list)
  - [Required relation](#required-relation)
  - [Connection helper](#connection-helper)
  - [Build input data only](#build-input-data-only)
  - [has-many / has-one relation](#has-many--has-one-relation)
  - [Custom scalar field generation](#custom-scalar-field-generation)
  - [Traits](#traits)
  - [Field value precedence](#field-value-precedence)
  - [More examples](#more-examples)
- [Generator configuration](#generator-configuration)
- [Tips](#tips)
  - [Works with jest-prisma](#works-with-jest-prisma)
  - [Suppress TS circular dependencies error](#suppress-ts-circular-dependencies-error)
- [License](#license)

<!-- tocstop -->

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
initialize({ prisma });

async function seed() {
  const UserFactory = defineUserFactory();

  await UserFactory.create();
  await UserFactory.create({ name: "Alice" });
  await UserFactory.create({ id: "user002", name: "Bob" });

  console.log(await prisma.user.count()); // -> 3
}

seed();
```

Note: The factories use Prisma client instance passed by `initialize` function.

If you want to use factories in your test code see [Works with jest-prisma](#works-with-jest-prisma) section below.

## Usage of factories

### Field default values

Factory by defined with `defineUserFactory` automatically fills scalar fields.

For example, the following `User` model has some required field, `id`, `email`, `firstName` and `lastName` .

```graphql
model User {
  id          Int      @id
  email       String   @unique
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

### Use sequence for scalar fields

`seq` parameter provides sequential number which increments when called `.create()` .

```ts
const UserFactory = defineUserFactory({
  defaultData: async ({ seq }) => ({
    id: `user${seq.toString().padStart(3, "0")}`,
  }),
});

await UserFactory.create(); // Insert with id: "user000"
await UserFactory.create(); // Insert with id: "user001"
await UserFactory.create(); // Insert with id: "user002"
```

And the sequential number can be reset via `resetSequence` .

```ts
/* your.testSetup.ts */

import { resetSequence } from "./__generated__/fabbrica";

beforeEach(() => resetSequence());
```

### Shorthand for create list

Each factory provides `.createList` method to insert multiple records.

```ts
await UserFactory.createList(3);

// The above code is equivalent to the following

await Promise.all([0, 1, 2].map(() => UserFactory.create()));
```

You can also pass list data assignable to `Partial<Prisma.UserCreateInput>[]` :

```ts
await UserFactory.createList([{ id: "user01" }, { id: "user02" }]);
```

### Required relation

Sometimes, creating a model requires other model existence. For example, the following model `Post` belongs to other model `User`.

```graphql
model User {
  id    String @id
  name  String
  posts Post[]
}

model Post {
  id       String @id
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

You should tell how to connect `author` field when define Post factory.

#### Using related model factory (recommended)

The easiest way is to give `UserFactory` when `definePostFactory` like this:

```ts
const UserFactory = defineUserFactory();

const PostFactory = definePostFactory({
  defaultData: {
    author: UserFactory,
  },
});
```

The above `PostFactory` creates `User` model for each `PostFactory.create()` calling,

#### Manual create or connect

Similar to using `prisma.post.create`, you can also use `connect` / `craete` / `createOrConnect` options.

```ts
const PostFactory = definePostFactory({
  defaultData: async () => ({
    author: {
      connect: {
        id: (await prisma.user.findFirst()!).id,
      },
      // Alternatively, create or createOrConnect options are allowed.
    },
  }),
});
```

### Connection helper

Required relation rules can be overwritten when `.create` method. `createForConnect` can be used to connect.

```ts
const UserFactory = defineUserFactory();

const PostFactory = definePostFactory({
  defaultData: {
    author: UserFactory,
  },
});

const author = await UserFactory.createForConnect();
await PostFactory.create({ author: { connect: author } });
await PostFactory.create({ author: { connect: author } });

const { posts } = await prisma.user.findUnique({ where: author, include: { posts: true } });
console.log(posts.length); // -> 2
```

### Build input data only

`.build` method in factories provides data set to create the model, but never insert.

```ts
await UserFactory.create();

// The above code is equivalent to the bellow:
const data = await UserFactory.build();
await prisma.user.create({ data });
```

For example, you can use `.build` method in other model's factory definition:

```ts
const UserFactory = defineUserFactory();

const PostFactory = definePostFactory({
  defaultData: async () => ({
    author: {
      connectOrCreate: {
        where: {
          id: "user001",
        },
        create: await UserFactory.build({
          id: "user001",
        }),
      },
    },
  }),
});

await PostFactory.create();
await PostFactory.create();

console.log(await prisma.user.count()); // -> 1
```

Like `createList`, `buildList` is also available.

### has-many / has-one relation

Sometimes, you may want a user data whose has post record. You can use `PostFactory.build` or `PostFactory.buildList` .

```ts
await UserFactory.create({
  posts: {
    create: await PostFactory.buildList(2),
  },
});

console.log(await prisma.post.count()); // -> 2
```

Note: In the above example, `PostFactory.build()` resolves JSON data such as:

```ts
{
  id: "...",
  title: "...",
  author: { ... } // Derived from PostFactory defaultData
}
```

The `author` field is not allowed in `prisma.user.create` context. So `UserFactory` automatically filters the `author` field out in `.create` method.

### Custom scalar field generation

prisma-fabbrica provides function to complete scalar fields( https://github.com/Quramy/prisma-fabbrica/blob/main/packages/prisma-fabbrica/src/scalar/gen.ts ).

`registerScalarFieldValueGenerator` allows to custom this rule. For example:

```ts
import { registerScalarFieldValueGenerator } from "./__generated__/fabbrica";

registerScalarFieldValueGenerator({
  String: ({ modelName, fieldName, seq }) => `${modelName}_${fieldName}_${seq}`,
});
```

`registerScalarFieldValueGenerator` accepts an object `Record<FiledType, FieldGenerateFunction>`.
Field type is one of `Boolean`, `String`, `Int`, `Float`, `BigInt`, `Decimal`, `DateTime`, `Bytes`, and `Json`.
`FieldGenerateFunction` is a function to return corresponding fieled type.

See also https://github.com/Quramy/prisma-fabbrica/blob/main/packages/prisma-fabbrica/src/scalar/types.ts .

### Traits

Traits allow you to group fields together and apply them to factory.

```ts
const UserFactory = defineUserFactory({
  defaultData: {
    name: "sample user",
  },
  traits: {
    withdrawal: {
      data: {
        name: "****",
        status: "WITHDRAWAL",
      },
    },
  },
});
```

`traits` option accepts an object and the option object's keys are treated as the trait's name. And you can set `data` option to the each trait key. The `data` option accepts value of the same types as the `defaultData` (i.e. plain object, function, async function)

And you can pass the trait's name to `UserFactory.use` function:

```ts
const deactivatedUser = await UserFactory.use("withdrawal").create();
```

Multiple traits are also available:

```ts
await UserFactory.use("someTrait", "anotherTrait").create();
```

### Field value precedence

Each field is determined in the following priority order(lower numbers have higher priority):

1. Factory's `.create` or `.build` function's argument
1. The applied trait's `data` entry
1. Factories `defaultData` entry
1. Value derived from `registerScalarFieldValueGenerator` if the field is required scalar(or enum)

### More examples

There are more example codes in https://github.com/Quramy/prisma-fabbrica/tree/main/examples/example-prj/src .

## Generator configuration

The following options are available:

```graphql
generator fabbrica {
  provider    = "prisma-fabbrica"
  output      = "../src/__generated__/fabbrica"
  tsconfig    = "../tsconfig.json"
  noTranspile = false
}
```

- `output`: Directory path to generate files.
- `tsconfig`: TypeScript configuration file path. prisma-fabbrica uses it's `compilerOptions` when generating `.js` and `.d.ts` files. If missing tsconfig json file, fallback to `--target es2020 --module commonjs`.
- `noTranspile`: If set `true`, this generator only generates raw `.ts` file and stop to transpile to `.js` and `.d.ts` .

## Tips

### Works with jest-prisma

If you use [@quramy/jest-prisma](https://github.com/Quramy/jest-prisma) or [@quramy/jest-prisma-node](https://github.com/Quramy/jest-prisma/tree/main/packages/jest-prisma-node), you can pass `@quramy/prisma-fabbrica/scripts/jest-prisma` to `setupFilesAfterEnv` in your Jest configuration file.

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

### Suppress TS circular dependencies error

Sometimes, factories need each other factory as the following, however TypeScript compiler emits errors via circular dependencies.

```ts
// 'UserFactory' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.
export const UserFactory = defineUserFactory({
  defaultData: async () => ({
    posts: {
      connect: await PostFactory.buildList(1),
    },
  }),
});

// 'PostFactory' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.
const PostFactory = definePostFactory({
  defaultData: {
    author: UserFactory,
  },
});
```

`FactoryInterface` types are available to avoid this error.

```ts
import { defineUserFactory, definePostFactory, type UserFactoryInterface } from "./__generated__/fabbrica";

const UserFactory = defineUserFactory({
  defaultData: async () => ({
    posts: {
      connect: await PostFactory.buildList(1),
    },
  }),
});

function getUserFactory(): UserFactoryInterface {
  return UserFactory;
}

const PostFactory = definePostFactory({
  defaultData: {
    author: getUserFactory(),
  },
});
```

## License

MIT

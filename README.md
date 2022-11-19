# prisma-fabbrica

Factory helper for Prisma.

## Setup

```graphql
generator client {
  provider = "prisma-client-js"
}

generator fabbrica {
  provider = "prisma-fabbrica"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Works with jest-prisma

If you use [@quramy/jest-prisma](https://github.com/Quramy/jest-prisma), you can pass `@quramy/prisma-fabbrica/scripts/jest-prisma` to `setupFilesAfterEnv` in your Jest configuration file.

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

This script configures Prisma client used from each factory to integrate to join to transaction managed by jest-prisma.

## License

MIT

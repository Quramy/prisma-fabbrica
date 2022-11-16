# prisma-fabbrica

Factory helper for Prisma.

## Setup

```graphql
generator client {
  provider        = "prisma-client-js"
}

generator fabbrica {
  provider = "prisma-fabbrica"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

## License

MIT

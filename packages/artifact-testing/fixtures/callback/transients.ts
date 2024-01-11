// TODO replace later
// import { initialize, defineUserFactory } from "./__generated__/fabbrica";
import { defineUserFactory, type UserFactoryInterface, type UserFactoryDefineOptions } from "./fabbrica.modified";

export async function seed() {
  const UserFactory = defineUserFactory.withExtraParameters({ loginCount: 0 })({
    traits: {
      withLoginRecords: {
        data: ({ loginCount }) => {
          console.log(loginCount);
          return {};
        },
        onAfterCreate: async ({ id, loginCount }) => {
          console.log(id, loginCount);
          // await LoginHistoryFactory.createList(loginCount, { id })
        },
      },
    },
  });

  await UserFactory.build();
  await UserFactory.build({ loginCount: 100 });
  await UserFactory.use("withLoginRecords").build({ loginCount: 100 });
}

export async function seedWithExplicitTypes() {
  type Context = {
    readonly loginCount: number;
  };

  const withLoginRecords = Symbol("withLoginRecords");

  function getUserFactory(): UserFactoryInterface<Context, { traits: { [withLoginRecords]: {} } }> {
    const factoryOptions = {
      traits: {
        [withLoginRecords]: {
          async onAfterCreate({ loginCount }) {
            console.log(loginCount);
          },
        },
      },
    } satisfies UserFactoryDefineOptions<Context>;

    const userFactory = defineUserFactory.withExtraParameters<Context>({ loginCount: 0 })(factoryOptions);

    return userFactory;
  }

  await getUserFactory().use(withLoginRecords).create({ name: "quramy", loginCount: 100 });
}

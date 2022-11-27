import { Resolver } from "@quramy/prisma-fabbrica/lib/helpers";

type UserFactoryDefineInput = {
  id?: string;
  name?: string;
  status?: "Active" | "Withdrawal";
};

type UserFactoryTraitOptions = {
  data?: Resolver<Partial<UserFactoryDefineInput>>;
};

type UserFactoryDefineOptions = {
  defaultData?: Resolver<UserFactoryDefineInput>;
  traits?: Record<string, UserFactoryTraitOptions>;
};

declare function defineUserFactory<TOptions extends UserFactoryDefineOptions>(
  options: TOptions,
): { create: (_: any, traits?: (keyof TOptions["traits"])[]) => null };

const UserFactory = defineUserFactory({
  defaultData: {
    status: "Active",
  },
  traits: {
    withdrawal: {
      data: async () => ({
        name: "***",
        status: "Withdrawal",
      }),
    },
  },
});

// Without traits
UserFactory.create({});

// With trait
UserFactory.create({ id: "quramy" }, ["withdrawal"]);

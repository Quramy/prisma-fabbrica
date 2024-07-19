import type { PrismaClient, User } from "../../fixtures/simple-model/__generated__/client";

import { initialize, defineUserFactory } from "../../fixtures/simple-model/__generated__/fabbrica";

describe("callback functions", () => {
  beforeAll(() => {
    const clientStub = {
      user: { create: jest.fn().mockReturnValue({ id: "stub id", name: "stub name" } as User) },
    } as unknown as PrismaClient;
    initialize({ prisma: clientStub });
  });

  test("onAfterBuild", async () => {
    const mock = jest.fn();
    const UserFactory = defineUserFactory({
      onAfterBuild: user => {
        mock(user);
      },
    });

    await UserFactory.build({ id: "id", name: "name" });

    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith({ id: "id", name: "name" });
  });

  test("onBeforeCreate", async () => {
    const mock = jest.fn();
    const UserFactory = defineUserFactory({
      onBeforeCreate: user => {
        mock(user);
      },
    });

    await UserFactory.create({ id: "id", name: "name" });

    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith({ id: "id", name: "name" });
  });

  test("onAfterCreate", async () => {
    const mock = jest.fn();
    const UserFactory = defineUserFactory({
      onAfterCreate: user => {
        mock(user);
      },
    });

    await UserFactory.create();

    expect(mock).toBeCalledTimes(1);
    expect(mock).toBeCalledWith({ id: "stub id", name: "stub name" });
  });

  describe("callbacks with transient fields", () => {
    test("onAfterBuild", async () => {
      const mock = jest.fn();
      const UserFactory = defineUserFactory.withTransientFields({
        hoge: 0,
      })({
        onAfterBuild: (_, { hoge }) => {
          mock(hoge);
        },
      });

      await UserFactory.build({ hoge: 100 });

      expect(mock).toBeCalledTimes(1);
      expect(mock).toBeCalledWith(100);
    });

    test("onBeforeCreate", async () => {
      const mock = jest.fn();
      const UserFactory = defineUserFactory.withTransientFields({
        hoge: 0,
      })({
        onBeforeCreate: (_, { hoge }) => {
          mock(hoge);
        },
      });

      await UserFactory.create({ hoge: 100 });

      expect(mock).toBeCalledTimes(1);
      expect(mock).toBeCalledWith(100);
    });

    test("onAfterCreate", async () => {
      const mock = jest.fn();
      const UserFactory = defineUserFactory.withTransientFields({
        hoge: 0,
      })({
        onAfterCreate: (_, { hoge }) => {
          mock(hoge);
        },
      });

      await UserFactory.create({ hoge: 100 });

      expect(mock).toBeCalledTimes(1);
      expect(mock).toBeCalledWith(100);
    });
  });

  test("callback orders with traits", async () => {
    const mock = jest.fn();
    const UserFactory = defineUserFactory({
      onAfterBuild: () => {
        mock("factory default", "onAfterBuild");
      },
      onBeforeCreate: () => {
        mock("factory default", "onBeforeCreate");
      },
      onAfterCreate: () => {
        mock("factory default", "onAfterCreate");
      },
      traits: {
        a: {
          onAfterBuild: () => {
            mock("trait a", "onAfterBuild");
          },
          onBeforeCreate: () => {
            mock("trait a", "onBeforeCreate");
          },
          onAfterCreate: () => {
            mock("trait a", "onAfterCreate");
          },
        },
        b: {
          onAfterBuild: () => {
            mock("trait b", "onAfterBuild");
          },
          onBeforeCreate: () => {
            mock("trait b", "onBeforeCreate");
          },
          onAfterCreate: () => {
            mock("trait b", "onAfterCreate");
          },
        },
      },
    });

    await UserFactory.use("a", "b").create();

    expect(mock).toHaveBeenNthCalledWith(1, "factory default", "onAfterBuild");
    expect(mock).toHaveBeenNthCalledWith(2, "trait a", "onAfterBuild");
    expect(mock).toHaveBeenNthCalledWith(3, "trait b", "onAfterBuild");
    expect(mock).toHaveBeenNthCalledWith(4, "trait b", "onBeforeCreate");
    expect(mock).toHaveBeenNthCalledWith(5, "trait a", "onBeforeCreate");
    expect(mock).toHaveBeenNthCalledWith(6, "factory default", "onBeforeCreate");
    expect(mock).toHaveBeenNthCalledWith(7, "factory default", "onAfterCreate");
    expect(mock).toHaveBeenNthCalledWith(8, "trait a", "onAfterCreate");
    expect(mock).toHaveBeenNthCalledWith(9, "trait b", "onAfterCreate");
  });
});

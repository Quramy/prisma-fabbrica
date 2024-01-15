import type { PrismaClient } from "./__generated__/client";
import { initialize, defineUserFactory } from "./__generated__/fabbrica";

import type { PrismaClient as PrismaClientAlt } from "./__generated__/client";
import {
  initialize as initializeAlt,
  defineUserFactory as defineAltUserFactory,
} from "../field-variation/__generated__/fabbrica";

describe("initialize function", () => {
  describe("initialize function binds prisma instance for each fabbrica script", () => {
    const prismaClientMock = {
      user: {
        create: jest.fn(),
      },
    };
    const prismaClientMockAlt = {
      user: {
        create: jest.fn(),
      },
    };
    const UserFactory = defineUserFactory();
    const AltUserFactory = defineAltUserFactory();

    beforeAll(() => {
      initialize({ prisma: prismaClientMock as unknown as PrismaClient });
      initializeAlt({ prisma: prismaClientMockAlt as unknown as PrismaClientAlt });
    });

    beforeEach(() => {
      prismaClientMock.user.create.mockReset();
      prismaClientMockAlt.user.create.mockReset();
    });

    it("should be called multiple clients called when multiple fabbrica are executed", async () => {
      await UserFactory.create();
      await AltUserFactory.create();

      expect(prismaClientMock.user.create).toHaveBeenCalledTimes(1);
      expect(prismaClientMockAlt.user.create).toHaveBeenCalledTimes(1);
    });

    it("should not be called a client unless the corresponding fabbrica is executed", async () => {
      await UserFactory.create();

      expect(prismaClientMock.user.create).toHaveBeenCalledTimes(1);
      expect(prismaClientMockAlt.user.create).not.toHaveBeenCalled();
    });
  });
});

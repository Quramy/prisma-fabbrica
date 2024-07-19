import type { PrismaClient } from "../../fixtures/simple-model/__generated__/client";
import { initialize, defineUserFactory } from "../../fixtures/simple-model/__generated__/fabbrica";

import type { PrismaClient as PrismaClientAlt } from "../../fixtures/simple-model/__generated__/client";
import {
  initialize as initializeAlt,
  defineEnumModelFactory as defineAltModelFactory,
} from "../../fixtures/field-variation/__generated__/fabbrica";

describe("initialize function", () => {
  describe("initialize function binds prisma instance for each fabbrica script", () => {
    const prismaClientMock = {
      user: {
        create: jest.fn(),
      },
    };
    const prismaClientMockAlt = {
      enumModel: {
        create: jest.fn(),
      },
    };
    const UserFactory = defineUserFactory();
    const AltModelFactory = defineAltModelFactory();

    beforeAll(() => {
      initialize({ prisma: prismaClientMock as unknown as PrismaClient });
      initializeAlt({ prisma: prismaClientMockAlt as unknown as PrismaClientAlt });
    });

    beforeEach(() => {
      prismaClientMock.user.create.mockReset();
      prismaClientMockAlt.enumModel.create.mockReset();
    });

    it("should be called multiple clients called when multiple fabbrica are executed", async () => {
      await UserFactory.create();
      await AltModelFactory.create();

      expect(prismaClientMock.user.create).toHaveBeenCalledTimes(1);
      expect(prismaClientMockAlt.enumModel.create).toHaveBeenCalledTimes(1);
    });

    it("should not be called a client unless the corresponding fabbrica is executed", async () => {
      await UserFactory.create();

      expect(prismaClientMock.user.create).toHaveBeenCalledTimes(1);
      expect(prismaClientMockAlt.enumModel.create).not.toHaveBeenCalled();
    });
  });
});

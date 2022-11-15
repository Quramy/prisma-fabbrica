import { prisma } from "../client";

jest.mock("../client", () => {
  return {
    prisma: jestPrisma.client,
  };
});

describe("mocked singleton", () => {
  test("works as client", async () => {
    await prisma.user.create({
      data: {
        id: "001",
        name: "quramy",
      },
    });
  });

  test("transaction isolated", async () => {
    expect(await prisma.user.count()).toBe(0);
  });
});

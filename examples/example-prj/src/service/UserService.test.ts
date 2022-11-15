/**
 *
 * @jest-environment-options { "verboseQuery": true }
 *
 */
import { UserService } from "./UserService";

describe(UserService, () => {
  const prisma = jestPrisma.client;

  test("Add user", async () => {
    const service = new UserService(prisma);
    const createdUser = await service.addUser("quramy");

    expect(
      await prisma.user.findFirst({
        where: {
          name: "quramy",
        },
      }),
    ).toStrictEqual(createdUser);
  });

  test("No users", async () => {
    expect(await prisma.user.count()).toBe(0);
  });
});

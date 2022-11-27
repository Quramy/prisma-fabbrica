import { DMMF } from "@prisma/generator-helper";
import { getDMMF } from "@prisma/internals";
import { createFieldDefinitions, createScreener } from "./screen";

describe(createScreener, () => {
  let document: DMMF.Document;
  let subject: <T>(data: T) => T;
  describe("For User - Post releation", () => {
    beforeEach(async () => {
      document = await getDMMF({
        datamodel: `
          model User {
            id     Int     @id
            posts  Post[]
          }
          model Post {
            id        Int  @id
            authorId  Int
            author    User @relation(fields: [authorId], references: [id])
          }
        `,
      });
    });

    describe("User screen", () => {
      beforeEach(() => {
        subject = createScreener("User", createFieldDefinitions(document.datamodel.models));
      });
      it("screens author in posts create relation", () => {
        expect(
          subject({
            id: "",
            posts: {
              create: [{ id: "", author: {} }],
            },
          }),
        ).toEqual({
          id: "",
          posts: {
            create: [{ id: "" }],
          },
        });
      });

      it("screens author in posts connectOrCreate relation", () => {
        expect(
          subject({
            id: "",
            posts: {
              connectOrCreate: [{ where: { id: "" }, create: { id: "", author: {} } }],
            },
          }),
        ).toEqual({
          id: "",
          posts: {
            connectOrCreate: [{ where: { id: "" }, create: { id: "" } }],
          },
        });
      });

      it("does nothing for connect", () => {
        expect(
          subject({
            id: "",
            posts: {
              connect: [{ id: "", name: "" }],
            },
          }),
        ).toEqual({
          id: "",
          posts: {
            connect: [{ id: "", name: "" }],
          },
        });
      });
    });

    describe("Post screen", () => {
      beforeEach(() => {
        subject = createScreener("Post", createFieldDefinitions(document.datamodel.models));
      });

      it("screening posts in user create relation", () => {
        expect(
          subject({
            id: "",
            author: {
              create: { id: "", posts: [] },
            },
          }),
        ).toEqual({
          id: "",
          author: {
            create: { id: "" },
          },
        });
      });

      it("screening posts in user connectOrCreate relation", () => {
        expect(
          subject({
            id: "",
            author: {
              connectOrCreate: {
                where: { id: "" },
                create: { id: "", posts: [] },
              },
            },
          }),
        ).toEqual({
          id: "",
          author: {
            connectOrCreate: {
              where: { id: "" },
              create: { id: "" },
            },
          },
        });
      });

      it("does nothing for connect", () => {
        expect(
          subject({
            id: "",
            author: {
              connect: { id: "", name: "" },
            },
          }),
        ).toEqual({
          id: "",
          author: {
            connect: { id: "", name: "" },
          },
        });
      });
    });
  });
});

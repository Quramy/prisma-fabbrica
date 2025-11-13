import { definePostFactory, defineUserFactory } from "../../fixtures/view-relations/__generated__/fabbrica";

export const UserFactory = defineUserFactory();

export const PostFactoryAlt = definePostFactory({
  defaultData: {
    author: UserFactory,
  },
});

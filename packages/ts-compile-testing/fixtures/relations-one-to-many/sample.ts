import { definePostFactory, defineUserFactory, defineReviewFactory } from "./__generated__/fabbrica";

export const UserFactory = defineUserFactory();
export const PostFactory = definePostFactory();
export const ReviewFactory = defineReviewFactory({
  defaultData: {
    post: PostFactory,
    reviewer: UserFactory,
  },
});
export const PostFactoryAlt = definePostFactory({
  defaultData: {
    author: UserFactory,
  },
});

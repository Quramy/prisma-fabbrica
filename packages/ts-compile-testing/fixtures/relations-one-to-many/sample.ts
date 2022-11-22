import { definePostFactory, defineUserFactory, defineReviewFactory } from "./__generated__/fabbrica";

export const UserFactory = defineUserFactory({ defaultData: {} });
export const PostFactory = definePostFactory({ defaultData: {} });
export const ReviewFactory = defineReviewFactory({
  defaultData: {
    post: PostFactory,
    reviewer: UserFactory,
  },
});

import { defineUserFactory, defineProfileFactory } from "./__generated__/fabbrica";

export const UserFactory = defineUserFactory();
export const ProfileFactory = defineProfileFactory({ defaultData: { user: UserFactory } });

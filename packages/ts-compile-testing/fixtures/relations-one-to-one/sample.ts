import { defineUserFactory, defineProfileFactory } from "./__generated__/fabbrica";

export const UserFactory = defineUserFactory({ defaultData: {} });
export const ProfileFactory = defineProfileFactory({ defaultData: { user: UserFactory } });

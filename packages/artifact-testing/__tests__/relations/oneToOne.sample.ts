import { defineUserFactory, defineProfileFactory } from "../../fixtures/relations-one-to-one/__generated__/fabbrica";

export const UserFactory = defineUserFactory();
export const ProfileFactory = defineProfileFactory({ defaultData: { user: UserFactory } });

import { defineUserFactory } from "./__generated__/fabbrica";

export const UserFactoryWithSeq = defineUserFactory({
  defaultData: async ({ seq }) => ({
    id: seq.toString(),
  }),
});

import { definePostFactory } from "./__generated__/fabbrica"

export const PostFactory = definePostFactory({
  defaultData: async () => ({
    title: generateRandomTitle(),
  })
})

function generateRandomTitle() {
  // dummy
  return "";
}

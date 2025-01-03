import { createApp } from "vue"

import { image } from "~~/test/unit/fixtures/image"
import { render } from "~~/test/unit/test-utils/render"

import VImageResult from "~/components/VImageResult/VImageResult.vue"

const RouterLinkStub = createApp({}).component("RouterLink", {
  template: "<a :href='href'><slot /></a>",
  props: ["to"],
  computed: {
    href() {
      return this.to
    },
  },
})._context.components.RouterLink
describe("VImageResult", () => {
  let options = {}

  beforeEach(() => {
    options = {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
      props: {
        image,
        kind: "search",
        searchTerm: "cat",
        relatedTo: null,
      },
    }
  })

  it("is blurred when the image is sensitive", async () => {
    options.props.image.isSensitive = true
    const { getByTestId } = await render(VImageResult, options)
    const overlay = getByTestId("blur-overlay")
    expect(overlay).toBeVisible()
  })

  it("is does not contain title anywhere when the image is sensitive", async () => {
    options.props.image.isSensitive = true
    const screen = await render(VImageResult, options)
    const match = RegExp(image.title)
    expect(screen.queryAllByText(match)).toEqual([])
    expect(screen.queryAllByTitle(match)).toEqual([])
    expect(screen.queryAllByAltText(match)).toEqual([])
  })
})

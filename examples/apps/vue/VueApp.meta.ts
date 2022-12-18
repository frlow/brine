import type { WcWrapperOptionsMeta } from 'brinejs'
export const meta: WcWrapperOptionsMeta = {
  emits: ["my-event"],
  attributes: ["count"],
  style: `.dummy-style{}`,
  tag: 'my-vue-app',
}
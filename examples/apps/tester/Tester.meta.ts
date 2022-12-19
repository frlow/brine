import type { WcWrapperOptionsMeta } from 'brinejs'
export const meta: WcWrapperOptionsMeta = {
  emits: ["my-event"],
  attributes: ["text","obj"],
  style: `.dummy-style{}`,
  tag: 'my-tester',
}
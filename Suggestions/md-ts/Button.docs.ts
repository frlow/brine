import { example } from '../common/lib'
import { Button } from '../common/types'

export const button = example<Button>({
  text: 'SomeText',
  click: true,
})

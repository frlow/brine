import { doc, example } from '../common/lib'
import { Button } from '../common/types'

export default doc(
  `# Button
  My button is awesome`,
  example<Button>({
    text: 'SomeText',
    click: true,
  }),
  `This is more text,
  MOAR!!!`
)

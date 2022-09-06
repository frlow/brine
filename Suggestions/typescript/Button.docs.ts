import { doc, example } from '../common/lib'
import { Button } from '../common/types'

export default doc(
  `# Button
  My button is awesome`,
  example<Button>({
    text: 'SomeText',
    click: () => {
      console.log('Click')
    },
  }),
  `This is more text,
  MOAR!!!`
)

// This is a handwritten file!!!
import { WcWrapperOptions } from '@frlow/brine'

export const options: WcWrapperOptions = {
  init: (self, emit) => {
    const count = document.createElement('div')
    count.id = 'count'
    self.shadowRoot.appendChild(count)
    const button = document.createElement('button')
    button.className = 'demo'
    button.innerText = 'Button'
    button.onclick = (e) => {
      e.preventDefault()
      emit('my-event', 'demo')
    }
    self.shadowRoot.appendChild(button)
    const slot = document.createElement('slot')
    self.shadowRoot.appendChild(slot)
  },
  attributes: ['count'],
  attributeChangedCallback: (self, name, newValue) => {
    const element = self.shadowRoot.getElementById(name)
    if (element) element.innerText = newValue
  },
  connected: () => {},
  disconnected: () => {},
  style: `.demo {
    color: firebrick;
}`,
  tag: 'my-vanilla',
}

import { WcWrapperOptions } from '../../src/wrapper'
import './style.css'

const index: WcWrapperOptions = {
  constructor: (self, emit) => {
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
  attributeChangedCallback: (state, root, name, oldValue, newValue) => {
    const element = root.getElementById(name)
    if (element) element.innerText = newValue
  },
  connected: (state, root, emit) => {},
  disconnected: () => {},
}

export default index

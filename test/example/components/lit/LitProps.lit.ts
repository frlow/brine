import { LitElement, html, property } from 'lit-element'

export default class extends LitElement {
  @property() stringprop: string = ''
  @property() numprop: number = 0
  @property() complexprop: { value: string } = { value: '' }
  @property() selectprop: 'a' | 'b' = 'a'
  @property() optionalprop?: string = 'default'

  render() {
    return html` <div>
      <div class="stringprop">${this.stringprop}</div>
      <div class="numprop">${this.numprop + 1}</div>
      <div class="complexprop">${this.complexprop?.value}</div>
      <div class="selectprop">${this.selectprop}</div>
      <div class="optionalprop">${this.optionalprop}</div>
    </div>`
  }
}

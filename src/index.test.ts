import { jest } from '@jest/globals'
import type { WcWrapperOptions } from './common.js'
import { screen } from '@testing-library/dom'
import { baseDefine } from './define.js'
import any = jasmine.any
import anything = jasmine.anything

describe('Web Component Wrapper', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    document.body.innerHTML = ''
  })

  test('text in div', async () => {
    const connected = jest.fn()
    const options: WcWrapperOptions = {
      tag: 'test-text',
      attributes: [],
      style: '',
      attributeChangedCallback: () => {},
      connected,
      disconnected: () => {},
      init: (self) => {
        const el = document.createElement('div')
        el.innerHTML = 'something'
        el.id = 'target'
        self.root.appendChild(el)
      },
    }
    baseDefine(options, options.tag)
    document.body.innerHTML = `<test-text role="text"></test-text>`
    const textEl = screen.getByRole('text') as any
    const text = textEl.root.getElementById('target').innerHTML
    expect(text).toEqual('something')
    expect(connected).toHaveBeenCalled()
  })

  test('attribute', async () => {
    const attributeChange = jest.fn()
    const options: WcWrapperOptions = {
      tag: 'test-attribute',
      attributes: ['text'],
      style: '',
      attributeChangedCallback: attributeChange,
      connected: () => {},
      disconnected: () => {},
      init: () => {},
    }
    baseDefine(options, options.tag)
    document.body.innerHTML = `<test-attribute role="text"></test-attribute>`
    const textEl = screen.getByRole('text')
    textEl.setAttribute('text', 'updated')
    expect(attributeChange).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'text',
      'updated'
    )
  })

  test('emit', async () => {
    const options: WcWrapperOptions = {
      tag: 'test-emit',
      attributes: [],
      style: '',
      attributeChangedCallback: () => {},
      connected: () => {},
      disconnected: () => {},
      init: (self, root, emit) => {
        const el = document.createElement('button')
        el.innerHTML = 'button'
        el.id = 'button'
        el.onclick = (e) => {
          e.preventDefault()
          emit('some-name', 'someDetail')
        }
        self.root.appendChild(el)
      },
    }
    baseDefine(options, options.tag)
    document.body.innerHTML = `<test-emit role="text"></test-emit>`
    const textEl = screen.getByRole('text') as any
    const eventListener = jest.fn()
    textEl.addEventListener('some-name', (e: any) => eventListener(e.detail))
    textEl.root.getElementById('button').click()
    expect(eventListener).toHaveBeenCalledWith('someDetail')
  })

  test('disconnect', async () => {
    const disconnected = jest.fn()
    const connected = jest.fn()
    const options: WcWrapperOptions = {
      tag: 'test-disconnect',
      attributes: [],
      style: '',
      attributeChangedCallback: () => {},
      connected,
      disconnected,
      init: () => {},
    }
    baseDefine(options, options.tag)
    document.body.innerHTML = `<test-disconnect></test-disconnect>`
    expect(connected).toHaveBeenCalled()
    expect(disconnected).not.toHaveBeenCalled()
    document.body.innerHTML = ``
    expect(disconnected).toHaveBeenCalled()
  })
})

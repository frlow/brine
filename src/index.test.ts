import { jest } from '@jest/globals'
import type { WcWrapperOptions } from './common.js'
import { screen } from '@testing-library/dom'
import { baseDefine } from './define.js'

const dummyOptions: Pick<
  WcWrapperOptions,
  | 'attributes'
  | 'style'
  | 'attributeChangedCallback'
  | 'connected'
  | 'disconnected'
  | 'init'
> = {
  attributes: [],
  style: '',
  attributeChangedCallback: () => {},
  connected: () => {},
  disconnected: () => {},
  init: () => {},
}

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

  test('Camel case named props should throw error', async () => {
    const options: WcWrapperOptions = {
      ...dummyOptions,
      tag: 'camel-case',
      attributes: ['camelCase'],
    }
    expect(() => baseDefine(options, options.tag)).toThrowError(
      `Attributes cannot contain uppercase letters, use kebab-cased names instead.
  The following attributes needs to have their names updated: camelCase`
    )
  })

  test('Kebab-cased attribute', async () => {
    const attributeChangedCallback = jest.fn()
    const options: WcWrapperOptions = {
      ...dummyOptions,
      tag: 'kebab-case-attribute',
      attributes: ['kebab-name'],
      attributeChangedCallback,
    }
    baseDefine(options, options.tag)
    document.body.innerHTML = `<kebab-case-attribute kebab-name="some-attribute"></kebab-case-attribute>`
    expect(attributeChangedCallback).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'kebabName',
      'some-attribute'
    )
  })

  test('camelCased prop', async () => {
    const attributeChangedCallback = jest.fn()
    const options: WcWrapperOptions = {
      ...dummyOptions,
      tag: 'camel-case-prop',
      attributes: ['kebab-name'],
      attributeChangedCallback,
    }
    baseDefine(options, options.tag)
    document.body.innerHTML = `<camel-case-prop role="test"></camel-case-prop>`
    const el = screen.getByRole('test') as any
    el.kebabName = 'some-attribute'
    expect(attributeChangedCallback).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'kebabName',
      'some-attribute'
    )
  })
})

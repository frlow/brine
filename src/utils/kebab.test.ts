import { camelize, kebabize } from './kebab.js'

describe('kebab', () => {
  test('base', () => {
    const str = 'word'
    const result = kebabize(str)
    expect(result).toEqual('word')
  })

  test('kebab', () => {
    const str = 'kebab-word'
    const result = kebabize(str)
    expect(result).toEqual('kebab-word')
  })

  test('camel', () => {
    const str = 'camelWord'
    const result = kebabize(str)
    expect(result).toEqual('camel-word')
  })

  test('underscore', () => {
    const str = 'underscore_word'
    const result = kebabize(str)
    expect(result).toEqual('underscore_word')
  })

  test('numbers', () => {
    const str = 'word1word'
    const result = kebabize(str)
    expect(result).toEqual('word1word')
  })
})

describe('camel', () => {
  test('base', () => {
    const str = 'word'
    const result = camelize(str)
    expect(result).toEqual('word')
  })

  test('kebab', () => {
    const str = 'kebab-word'
    const result = camelize(str)
    expect(result).toEqual('kebabWord')
  })

  test('camel', () => {
    const str = 'camelWord'
    const result = camelize(str)
    expect(result).toEqual('camelWord')
  })

  test('underscore', () => {
    const str = 'underscore_word'
    const result = camelize(str)
    expect(result).toEqual('underscore_word')
  })

  test('numbers', () => {
    const str = 'word1word'
    const result = camelize(str)
    expect(result).toEqual('word1word')
  })
})

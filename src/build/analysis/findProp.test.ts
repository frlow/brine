import { findProp } from './findProp.js'

describe('find prop', () => {
  test('find a prop in object', () => {
    const c = { c: 'val' }
    const b = { b: c }
    const obj = { a: b }
    const prop = findProp(obj, 'c', 'val')
    expect(prop.obj).toEqual(c)
    expect(prop.parents).toStrictEqual([b, obj])
  })

  test('looping props', async () => {
    const c = { c: 'val' }
    const b: any = { b: c, obj: {} }
    const obj = { a: b }
    b.obj = obj
    const prop = findProp(obj, 'c', 'val')
    expect(prop.obj).toEqual(c)
    expect(prop.parents).toStrictEqual([b, obj])
  })
})

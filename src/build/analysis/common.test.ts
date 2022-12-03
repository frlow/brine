import { AnalysisResult } from './common.js'

export const testProps = (result: AnalysisResult) => {
  expect(result.props.length).toEqual(6)
  expect(result.props[0]).toEqual({
    name: 'num',
    optional: false,
    type: 'number',
  })
  expect(result.props[1]).toEqual({
    name: 'str',
    optional: true,
    type: 'string',
  })
  expect(result.props[2]).toEqual({
    name: 'obj',
    optional: true,
    type: '{ val: string }',
  })
  expect(result.props[3]).toEqual({
    name: 'camel-name',
    optional: false,
    type: 'string',
  })
  expect(result.props[4]).toEqual({
    name: 'kebab-name',
    optional: false,
    type: 'string',
  })
  expect(result.props[5]).toEqual({
    name: 'underscore_name',
    optional: false,
    type: 'string',
  })
}

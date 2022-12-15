/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  maxWorkers: 1,
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  testPathIgnorePatterns: ['common.test.ts'],
  globals: {
    Uint8Array: Uint8Array,
  },
}

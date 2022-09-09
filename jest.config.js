/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  transform: {
    '\\..*$': 'esbuild-runner/jest',
  },
  // testEnvironment: 'jsdom',
  testMatch: ['**/*.test.ts'],
  globalSetup: 'jest-environment-puppeteer/setup',
  globalTeardown: 'jest-environment-puppeteer/teardown',
  testEnvironment: 'jest-environment-puppeteer',
}

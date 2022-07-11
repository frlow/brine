const baseSetup = require('jest-environment-puppeteer/lib/global').setup
const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = async (args) => {
  await exec('yon build:example')
  await baseSetup(args)
}

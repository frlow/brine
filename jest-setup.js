const baseSetup = require('jest-environment-puppeteer/lib/global').setup
const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = async (args) => {
  await exec('yarn brine build test/example -x ex -o test/dist')
  await baseSetup(args)
}

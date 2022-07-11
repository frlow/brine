const baseSetup = require('jest-environment-puppeteer/lib/global').setup
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const ts = 'yarn brine'
const js = 'yarn build && node ./dist/cli.js'

const builder = ts

module.exports = async (args) => {
  await exec(`${builder} build -x ex -o ./test/dist ./test/example`)
  await baseSetup(args)
}

const fs = require('fs')
const path = require('path')

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const outDir = process.argv[2]
const examplePackage = {
  name: '@frlow/brine-example',
  version: packageJson.version,
  main: './elements/index.js',
}

fs.writeFileSync(path.join(outDir, '.npmrc'), fs.readFileSync('.npmrc'))
fs.writeFileSync(
  path.join(outDir, 'package.json'),
  JSON.stringify(examplePackage, null, 2),
  'utf8'
)

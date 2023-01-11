import { spawnSync } from 'child_process'
import fs from 'fs'

const packageJson = {
  name: 'brinejs',
  version: '0.1.0',
  repository: 'https://github.com/frlow/brine',
  author: 'Fredrik Löwenhamn <fredrik.lowenhamn@gmail.com>',
  license: 'MIT',
  type: 'module',
  exports: {
    '.': {
      import: './index.js',
      require: './index.cjs',
      types: './index.d.ts',
    },
    './vue': {
      import: './vue.js',
      types: './vue.d.ts',
    },
    './react': {
      import: './react.js',
      types: './react.d.ts',
    },
    './svelte': {
      import: './svelte.js',
      types: './svelte.d.ts',
    },
    './solid': {
      import: './solid.js',
      types: './solid.d.ts',
    },
    './wrapper': {
      import: './wrapper.js',
      types: './wrapper.d.ts',
    },
    './core': {
      import: './core.js',
      types: './core.d.ts',
    },
  },
}

const getPackageVersion = () => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  return packageJson.version
}

const getCurrentVersion = () => {
  const result = spawnSync('npm', ['show', 'brinejs', 'dist-tags.latest'], {
    encoding: 'utf8',
  })
  const version = result.stdout.trim()
  return version
}

const getBetaVersion = () => {
  const result = spawnSync('npm', ['show', 'brinejs', 'dist-tags.beta'], {
    encoding: 'utf8',
  })
  const version = result.stdout.trim()
  const match = version.match(/beta-(.*)$/)[1]
  return (parseInt(match) + 1).toString().padStart(3, '0')
}

const publish = (version, beta) => {
  const newVersion = `${version}${beta ? `-beta-${beta}` : ''}`
  const tag = beta ? '--tag beta' : ''
  const args = ['publish'].concat(tag.split(' '))
  packageJson.version = newVersion
  fs.writeFileSync(
    'lib/package.json',
    JSON.stringify(packageJson, null, 2),
    'utf8'
  )
  console.log(beta ? '--tag beta' : '')
}

let current = getCurrentVersion()
const packageVersion = getPackageVersion()
if (current === packageVersion) publish(current, getBetaVersion())
else publish(packageVersion)

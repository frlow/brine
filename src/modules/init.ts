import fse from 'fs-extra'
import fs from 'fs'
import path from 'path'

const packageJson = {
  name: 'brine-demo',
  version: '1.0.0',
  main: 'index.js',
  license: 'MIT',
  scripts: {
    start: 'brine start -x my src',
    build: 'brine build -x my src',
  },
  dependencies: {
    '@frlow/brine': '^0.0.0',
  },
}

const tsconfigJson = {
  compilerOptions: {
    target: 'es2020',
    module: 'ESNext',
    esModuleInterop: true,
    declaration: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: 'Node',
    strict: true,
    skipLibCheck: true,
    resolveJsonModule: true,
    jsx: 'preserve',
    noEmit: true,
  },
}

export const init = async (source: string, outDir: string) => {
  await fse.copySync(source, path.join(outDir, 'src'))
  fs.writeFileSync(
    path.join(outDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf8'
  )
  fs.writeFileSync(
    path.join(outDir, 'tsconfig.json'),
    JSON.stringify(tsconfigJson, null, 2),
    'utf8'
  )
}

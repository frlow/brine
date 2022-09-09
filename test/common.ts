import * as fs from 'fs'
import * as path from 'path'
import esbuild from 'esbuild'
import { fakeFilePlugin } from '../src/utils/fakeFilePlugin'

const util = require('util')
const exec = util.promisify(require('child_process').exec)

const baseUrl = 'https://example.com'

const loadBundle = () =>
  fs.readFileSync(path.join(__dirname, 'dist', 'bundle', 'index.js'), 'utf8')

export const buildExample = async (autoImport: boolean) => {
  await exec(
    `yarn brine build test/example -x ex -o test/dist ${
      autoImport ? '' : '--no-auto-import'
    }`
  )
}

export const getTestHtml = (component: string) => `<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/alpinejs@3.10.2/dist/cdn.min.js" defer></script>
    <script>
        window.log=[]
    </script>
  </head>
  <body x-data="{loaded: 'isLoaded'}">
    ${component}
  <div x-bind:id="loaded"></div>
   <script src="/index.js"></script>
  </body>
</html>`

export const showComponent = async (
  component: string,
  code: string = loadBundle()
) => {
  await jestPuppeteer.resetPage()
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    // TODO: match request.url()
    if (request.url() === `${baseUrl}/index.js`)
      request.respond({
        contentType: 'application/javascript',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: code,
      })
    else if (request.url() === `${baseUrl}/`)
      request.respond({
        contentType: 'text/html',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: getTestHtml(component),
      })
    else request.continue()
  })
  await page.goto(baseUrl)
}

const vuePlugin = require('esbuild-plugin-vue3')

const getWrapperMain = (framework: string, testCase: string) => {
  switch (framework) {
    case 'vue':
      return `import {createApp} from 'vue' 
import App from "./${testCase}.vue";
const app = createApp(App);
app.mount("#app");`
    case 'react':
      return `import React from "react";
import ReactDOM from "react-dom";
import App from "./${testCase}";
ReactDOM.render(<App />, document.getElementById("app"));`
    default:
      throw `Wrapper testing of ${framework} is not implemented`
  }
}

const bundleTestApp = async (main: string, framework: string) => {
  const result = await esbuild.build({
    entryPoints: [path.join('test', 'wrapper', framework, 'main.ts')],
    bundle: true,
    write: false,
    format: 'iife',
    outdir: 'dist',
    plugins: [vuePlugin(), fakeFilePlugin(/main\.ts/, main)],
    sourcemap: false,
  })
  return result.outputFiles[0].text
}

export const buildTestApp = async (framework: string, testCase: string) => {
  const main = getWrapperMain(framework, testCase)
  return await bundleTestApp(main, framework)
}

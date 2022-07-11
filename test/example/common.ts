import * as fs from 'fs'
import * as path from 'path'
import { GenericComponent, WrapperModule } from '../../src/modules/Module'

const baseUrl = 'https://example.com'

const bundle = fs.readFileSync(path.join('test', 'dist', 'bundle', 'index.js'))
export const showComponent = async (component: string) => {
  await jestPuppeteer.resetPage()
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    // TODO: match request.url()
    if (request.url() === `${baseUrl}/index.js`)
      request.respond({
        contentType: 'application/javascript',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: bundle,
      })
    else if (request.url() === `${baseUrl}/`)
      request.respond({
        contentType: 'text/html',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: `<!DOCTYPE html>
<html>
  <head>
    <script src="/index.js"></script>
    <script src="https://unpkg.com/alpinejs@3.10.2/dist/cdn.min.js" defer></script>
    <script>
        window.log=[]
    </script>
  </head>
  <body x-data="{loaded: 'isLoaded'}">
    ${component}
  <div x-bind:id="loaded"></div>
  </body>
</html>`,
      })
    else request.continue()
  })
  await page.goto(baseUrl)
  await page.waitForSelector('#isLoaded')
}

export const manualWrapper = async (testApp: string) => {
  await jestPuppeteer.resetPage()
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    // TODO: match request.url()
    if (request.url() === `${baseUrl}/index.js`)
      request.respond({
        contentType: 'application/javascript',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: testApp,
      })
    else if (request.url() === `${baseUrl}/`)
      request.respond({
        contentType: 'text/html',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: `<!DOCTYPE html>
<html>
  <head>
    <script>
        window.log=[]
    </script>
  </head>
  <body>
    <div id="app"></div>
    <script src="/index.js"></script>
  </body>
</html>`,
      })
    else request.continue()
  })
  await page.goto(baseUrl)
  await page.waitForSelector('#isLoaded')
}

export const showWrapper = async (
  component: GenericComponent,
  wrapperModule: WrapperModule
) => {
  const testApp = await wrapperModule.buildTestApp(component)
  await manualWrapper(testApp)
  // await jestPuppeteer.debug()
}

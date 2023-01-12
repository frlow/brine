# brine

Brine is a set of tools for creating web components by wrapping applications written in popular frameworks.

It enables developers to write components in their favourite framework and use them in any other project, regardless of
what framework is used there.

More on the power of web components [here](https://www.webcomponents.org/introduction)

Currently, brine supports the following frameworks

- <img src="https://static.cdnlogo.com/logos/r/63/react.svg" alt="react" width="15"/> React
- <img src="https://static.cdnlogo.com/logos/v/69/vue.svg" alt="vue" width="15"/> Vue
- <img src="https://static.cdnlogo.com/logos/s/6/svelte.svg" alt="svelte" width="15"/> Svelte
- <img src="https://www.solidjs.com/img/logo/without-wordmark/logo.png" alt="solid" width="15"/> Solid

## Install

```
npm install --save brinejs
```

## Usage

brine consists of 2 separate layers and a meta object

- the wrapper, this is th web component that wraps around the framework code
- the options object, the internals that contain the framework specific code
- the meta object, contains metadata required to create thw component

### Examples

***react***

```typescript
import { define } from 'brinejs/react'
import App from './App'

define(App, {
    emits: ["change"],
    attributes: ["text", "header"],
    style: `.dummy-style{}`,
    tag: 'my-react-app',
})

```

***vue***

```typescript
import {createOptions} from 'brinejs/vue'
import App from './App.vue'
```

***svelte***

```typescript
import {createOptions} from 'brinejs/svelte'
import App from './App.svelte'
```

***solid js***

```typescript
import {createOptions} from 'brinejs/solid'
import App from './App'
```

## Build tools

Brine contains some helper functions that makes building and bundling
simpler.

***hot component transplant***

Hot component transplant server is a websocket server that allows developers
to automatically transplant components during development or debugging. 

```typescript
// build script
import {startHotComponentTransplantServer} from 'brinejs/build'

const hotTransplant = startHotComponentTransplantServer()
const build = () => {
    // ... some build code
    hotTransplant(['path/to/some/file/that/changed.js'])
}
```

```typescript
// in browser
new WebSocket('ws://localhost:8080').onmessage = 
    async (ev) => {import(ev.data+'?t='+Date.now())}
```

***boilerplate generation***

Brine has two code generation methods, 'writeMetaFile' and 'writeIndexFile'.
They can be used to generate boilerplate code, specifically the meta
object that describes the component.

#### meta file

```typescript
// Generate meta file
import {writeMetaFile} from '/brine'

await writeMetaFile('App.tsx', 'my') // (filePath, prefix or filename)
```

```typescript
// output
// App.meta.ts
export const meta = {
    emits: ["my-click"],
    attributes: ["count", "text", "obj"],
    style: `.dummy-style{}`,
    tag: 'my-app',
}
```

#### index file

```typescript
// Generate meta file
import {writeIndexFile} from '/brine'

await writeIndexFile('App.tsx', 'my') // (filePath, prefix or filename)
```

```typescript
// output
// index.ts
import { define } from 'brinejs/react'
import App from './SolidApp.js'

define(App, {
    emits: [] as string[],
    attributes: ["count"] as string[],
    style: `.dummy-style{}` as string,
    tag: 'my-solid-app' as string,
})

```

***css injection***

Most builders produce separate js and css files as build output.
Since the styling needs to be in the code, this styling must be injected into
the code somehow.

Brine has a helper method that can modify a bundled js file and inject css
into it. It also updates and adjusts the source map to match the
new content.

```typescript
import {writeJsMapCssGroup, groupJsMapCssFiles} from '/brine'

const groupedFiles = groupJsMapCssFiles(['./dist/App.js'])
await writeJsMapCssGroup(groupedFiles)
```

***type documentation***

Type documentation can be extracted and generated for the components

```typescript
import {
  generateTypes,
  writeTypesFile,
  writeVsCodeTypes,
  writeWebTypes
} from 'brine'

const types = await generateTypes(['src/App.tsx'], 'my')
// json file with serialized typing
await writeTypesFile(types, 'dist')

// vscode.html-custom-data.json (VsCode)
await writeVsCodeTypes(types, 'dist')

// web-types.json (JetBrains, IntelliJ/WebStorm)
await writeWebTypes(types, 'dist', {
  name: 'example',
  version: '1.0.0',
})

// react wrappers
await writeReactWrappersFile(types, 'dist/wrapper')
```
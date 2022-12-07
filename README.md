# brine
Brine is a set of tools for creating web components by wrapping applications written in popular frameworks.

It enables developers to write components in their favourite framework and use them in any other project, regardless of what framework is used there. 

More on the power of web components [here](https://www.webcomponents.org/introduction)

Currently, brine supports the following frameworks
- <img src="https://static.cdnlogo.com/logos/r/63/react.svg" alt="react" width="15"/> React
- <img src="https://static.cdnlogo.com/logos/v/69/vue.svg" alt="vue" width="15"/> Vue
- <img src="https://static.cdnlogo.com/logos/s/6/svelte.svg" alt="svelte" width="15"/> Svelte

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
```javascript
import { createWrapper } from 'brinejs'

// Replace this part with framework specific implementation
import { createOptions } from 'brinejs/react'
import App from './App.js' // jsx|tsx file
// =============================

const meta = {
    attributes: ["text", "disabled"], // names of attributes
    emits: ["my-click"], // names of emits 
    style: `.button{color: blue}`, // styling, more on this later
    tag: 'my-button', // the web component tag, must contain a "-"
}
const options = createOptions(App, meta)
const wrapper = createWrapper(options)
customElements.define(wrapper.options.tag,wrapper)
```

***vue***
```javascript
import { createOptions } from 'brinejs/vue'
import App from './App.vue'
```
***svelte***
```javascript
import { createOptions } from 'brinejs/svelte'
import App from './App.svelte'
```

## Extensions
There are 2 extensions available in brine that extends 
the functionality of the wrapper class

***transplantable wrapper***

Thr transplantable wrapper allows the options object inside the 
wrapper to be swapped out live during runtime. This can be leveraged to 
implement features such as hot replace. The code is split into 2 files
and uses an async import to allow the build engine (esbuild, rollup, etc.)
to split the code into multiple files. Be aware that importing the index
file again will result in an error since web components can only be loaded 
once. 
```javascript
// options.ts
import { createOptions } from 'brinejs/svelte'
import App from './App.svelte'
const meta = {
    attributes: ["text", "disabled"], // names of attributes
    emits: ["my-click"], // names of emits 
    style: `.button{color: blue}`, // styling, more on this later
    tag: 'my-button', // the web component tag, must contain a "-"
}
export const options = createOptions(App, meta)
```
```javascript
// index.ts
import {createWrapper} from 'brinejs'
import {createTransplantableWrapper} from 'brinejs/extensions'

import('./options.js').then(({options}) => {
    const wrapper = createTransplantableWrapper(options)
    customElements.define(wrapper.options.tag, wrapper)
})
```

To update the options object inside the web component wrapper, 
import a new options object and run the transplant method on the 
custom element class. 

```javascript
// Run in browser, devtools, console etc. 
import('./options-SOMEHASH.js').then(({options})=>{
    customElements.get("my-button").transplant(options)
})
```

***autoloader wrapper***

The autoloader wrapper creates an empty web component that 
automatically runs an async method to fetch the options object 
when the web component is first rendered. 
```javascript
// options.ts
import { createOptions } from 'brinejs/svelte'
import App from './App.svelte'
const meta = {
    attributes: ["text", "disabled"], // names of attributes
    emits: ["my-click"], // names of emits 
    style: `.button{color: blue}`, // styling, more on this later
    tag: 'my-button', // the web component tag, must contain a "-"
}
export const options = createOptions(App, meta)
```
Note that the autoloader wrapper needs to know the attributes and the tag 
before the content is imported. Make sure not to import the options 
object here since the purpose is to avoid loading the data before it is 
actually used.
```javascript
// index.ts
import {createWrapper} from 'brinejs'
import {createTransplantableWrapper} from 'brinejs/extensions'

const meta = {
    attributes: ["text", "disabled"],
    tag: 'my-button'
}
const wrapper = createAutoLoaderWrapper(
    meta, 
    async () => (await import('./options.js')).options)
```

The component can be manually loaded using the "load" method on 
the custom element class.
```javascript
customElements.get("my-button").load()
```

### Notes on the autoloader
A strategy that can be used with the autoloader is to build the options 
files separately and list them and their metadata in a json file. This file
can then be loaded using a shared loader function that defines all
web component wrappers.

```javascript
// loader.js
import { defineComponent } from 'brinejs'
import { createAutoLoaderWrapper } from 'brinejs/extensions'

fetch('/apps.json').then((result) => {
  result.apps.forEach(({meta, url}) => {
    defineComponent(
      createAutoLoaderWrapper(meta, async () =>
          (await import(url)).options)
    )
  })
})
```
```javascript
// apps.json
[
  {
    "meta": {
      "attributes": [
        "text"
      ],
      "tag": "my-label"
    },
    "url": "/my-label-SOMEHASH.js"
  },
  {
    "meta": {
      "attributes": [
        "value",
        "disabled"
      ],
      "tag": "my-button"
    },
    "url": "/my-button-SOMEHASH.js"
  }
]
```
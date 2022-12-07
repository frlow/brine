# brine
Brine is a set of tools for creating web components by wrapping applications written in popular frameworks.

It enables developers to write components in their favourite framework and use them in any other project, regardless of what framework is used there. 

More on the power of web components [here](https://www.webcomponents.org/introduction)

Currently, brine supports the following frameworks
<div style="display: flex; flex-direction:row; justify-content: center;"><span>Vue</span><img src="https://static.cdnlogo.com/logos/v/69/vue.svg" alt="vue" width="50"/></div>

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
    tag: 'my-app', // the web component tag, must contain a "-"
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

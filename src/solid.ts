import {WcWrapperOptions, WcWrapperOptionsMeta, camelize} from './common.js'
import {baseDefine} from './define.js'
import {render, createComponent} from 'solid-js/web'
import type {JSX} from 'solid-js'

export const createOptions = (
  Component: (props: any) => JSX.Element,
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => {
  return {
    init: (self, root, emit) => {
      self.props = {}
      self.render = () => {
        render(() => createComponent(Component, self.props), root)
      }
    },
    attributes: meta.attributes,
    attributeChangedCallback: (self, root, name, newValue) => {
      self.props[name] = newValue
      self.render()
    },
    connected: (self) => {
      self.render()
    },
    disconnected: (self) => {
      self.innerHTML = ''
    },
    style: meta.style,
    tag: meta.tag,
  }
}

export const define = (
  Component: (args: any) => JSX.Element,
  meta: WcWrapperOptionsMeta
) => baseDefine(createOptions(Component, meta), meta.tag)

const wc = 'web-components'
const vue3 = 'vue3'
const react = 'react'

class Example extends HTMLElement {
    getAttributeString(attribute, fw) {
        switch (fw) {
            case vue3:
                return ` :${attribute.name}='${this.stringifyIsh(attribute.value)}'`
            case react:
                return ` ${attribute.name}={${this.stringifyIsh(attribute.value)}}`
            case wc:
                return ` ${attribute.name}='${attribute.value}'`
            default:
                return ''
        }
    }

    getEmitString(emit, fw) {
        switch (fw) {
            case vue3:
                return ` @${emit}="var=>log(var)"`
            case react:
                return ` on${
                    emit.substring(0, 1).toUpperCase() + emit.substring(1)
                }={var=>log(var)}`
            default:
                return ''
        }
    }

    camelize(str, fw) {
        if (fw === wc) return str
        return str
            .split('-')
            .slice(1)
            .map((part) => part.substring(0, 1).toUpperCase() + part.substring(1))
            .join('')
    }

    stringifyIsh(str) {
        let value = `"${str}"`
        try {
            JSON.parse(str)
            value = str
        } catch {
        }
        return value
    }

    getElementTag(element, fw) {
        const attributes = []
        const emits = []
        for (const attribute of element.attributes) {
            if (attribute.name.startsWith('@')) {
                emits.push(attribute.name.replace(`@`, ''))
            } else if (attribute.name.startsWith(':')) {
                if (!element.attributes[attribute.name.replace(':', '')])
                    throw 'Bind not ready!'
            } else attributes.push(attribute)
        }
        const attributesText = attributes
            .map((a) => this.getAttributeString(a, fw))
            .join('')
        const emitsText = emits
            .map((e) => this.getEmitString(e, fw))
            .join('')
        return `<${this.camelize(
            element.localName,
            fw
        )}${attributesText}>${emitsText}`
    }

    getNativeTag(element) {
        let attributes = ''
        for (const attribute of element.attributes) {
            attributes += ` ${attribute.name}="${attribute.value}"`
        }
        return `<${element.localName}${attributes}>`
    }

    process(element, fw, prefix) {
        if (element.localName === 'ucp-example' && element.childNodes.length === 0)
            throw 'Not loaded yet!'
        if (element.wholeText) return element.wholeText.trim()
        let processed = ''
        processed +=
            element.localName === 'ucp-example'
                ? ''
                : element.localName.startsWith(`${prefix}-`)
                    ? this.getElementTag(element, fw)
                    : this.getNativeTag(element)
        let counter = 0
        for (const child of element.childNodes) {
            if (
                element.localName === 'ucp-example' &&
                counter++ >= element.childNodes.length - 1
            ) {
            } else if (element.localName !== 'slot')
                processed += this.process(child, fw, prefix)
        }
        processed +=
            element.localName === 'ucp-example'
                ? ''
                : element.localName.startsWith(`${prefix}-`)
                    ? `</${this.camelize(element.localName, fw)}>`
                    : `</${element.localName}>`
        return processed.trim()
    }

    render(framework, prefix) {
        try {
            const code = this.process(this, framework, prefix)
            this.shadowRoot.innerHTML = `<ucp-example-implementation code="${window.btoa(
                code
            )}"><slot></slot></ucp-example-implementation>`
        } catch (e) {
            const context = this
            setTimeout(() => {
                context.render(framework, prefix)
            }, 5)
        }
    }

    constructor() {
        super()

        let framework = document.createElement('template')
        framework.innerHTML = `<div x-init="$dispatch('update', {framework, prefix})"></div>`
        this.addEventListener('update', (ev) => {
            this.render(ev.detail.framework, ev.detail.prefix)
        })
        this.attachShadow({mode: 'open'})
        this._contents = new DocumentFragment()
        this._contents.appendChild(framework.content.cloneNode(true))
    }

    connectedCallback() {
        this.appendChild(this._contents)
    }
}

window.customElements.define('ucp-example', Example)

export const exampleCode = 'const wc = \'web-components\'\n' +
  'const vue3 = \'vue3\'\n' +
  'const react = \'react\'\n' +
  '\n' +
  'class Example extends HTMLElement {\n' +
  '    getAttributeString(attribute, fw) {\n' +
  '        switch (fw) {\n' +
  '            case vue3:\n' +
  '                return ` :${attribute.name}=\'${this.stringifyIsh(attribute.value)}\'`\n' +
  '            case react:\n' +
  '                return ` ${attribute.name}={${this.stringifyIsh(attribute.value)}}`\n' +
  '            case wc:\n' +
  '                return ` ${attribute.name}=\'${attribute.value}\'`\n' +
  '            default:\n' +
  '                return \'\'\n' +
  '        }\n' +
  '    }\n' +
  '\n' +
  '    getEmitString(emit, fw) {\n' +
  '        switch (fw) {\n' +
  '            case vue3:\n' +
  '                return ` @${emit}="var=>log(var)"`\n' +
  '            case react:\n' +
  '                return ` on${\n' +
  '                    emit.substring(0, 1).toUpperCase() + emit.substring(1)\n' +
  '                }={var=>log(var)}`\n' +
  '            default:\n' +
  '                return \'\'\n' +
  '        }\n' +
  '    }\n' +
  '\n' +
  '    camelize(str, fw) {\n' +
  '        if (fw === wc) return str\n' +
  '        return str\n' +
  '            .split(\'-\')\n' +
  '            .slice(1)\n' +
  '            .map((part) => part.substring(0, 1).toUpperCase() + part.substring(1))\n' +
  '            .join(\'\')\n' +
  '    }\n' +
  '\n' +
  '    stringifyIsh(str) {\n' +
  '        let value = `"${str}"`\n' +
  '        try {\n' +
  '            JSON.parse(str)\n' +
  '            value = str\n' +
  '        } catch {\n' +
  '        }\n' +
  '        return value\n' +
  '    }\n' +
  '\n' +
  '    getElementTag(element, fw) {\n' +
  '        const attributes = []\n' +
  '        const emits = []\n' +
  '        for (const attribute of element.attributes) {\n' +
  '            if (attribute.name.startsWith(\'@\')) {\n' +
  '                emits.push(attribute.name.replace(`@`, \'\'))\n' +
  '            } else if (attribute.name.startsWith(\':\')) {\n' +
  '                if (!element.attributes[attribute.name.replace(\':\', \'\')])\n' +
  '                    throw \'Bind not ready!\'\n' +
  '            } else attributes.push(attribute)\n' +
  '        }\n' +
  '        const attributesText = attributes\n' +
  '            .map((a) => this.getAttributeString(a, fw))\n' +
  '            .join(\'\')\n' +
  '        const emitsText = emits\n' +
  '            .map((e) => this.getEmitString(e, fw))\n' +
  '            .join(\'\')\n' +
  '        return `<${this.camelize(\n' +
  '            element.localName,\n' +
  '            fw\n' +
  '        )}${attributesText}>${emitsText}`\n' +
  '    }\n' +
  '\n' +
  '    getNativeTag(element) {\n' +
  '        let attributes = \'\'\n' +
  '        for (const attribute of element.attributes) {\n' +
  '            attributes += ` ${attribute.name}="${attribute.value}"`\n' +
  '        }\n' +
  '        return `<${element.localName}${attributes}>`\n' +
  '    }\n' +
  '\n' +
  '    process(element, fw, prefix) {\n' +
  '        if (element.localName === \'ucp-example\' && element.childNodes.length === 0)\n' +
  '            throw \'Not loaded yet!\'\n' +
  '        if (element.wholeText) return element.wholeText.trim()\n' +
  '        let processed = \'\'\n' +
  '        processed +=\n' +
  '            element.localName === \'ucp-example\'\n' +
  '                ? \'\'\n' +
  '                : element.localName.startsWith(`${prefix}-`)\n' +
  '                    ? this.getElementTag(element, fw)\n' +
  '                    : this.getNativeTag(element)\n' +
  '        let counter = 0\n' +
  '        for (const child of element.childNodes) {\n' +
  '            if (\n' +
  '                element.localName === \'ucp-example\' &&\n' +
  '                counter++ >= element.childNodes.length - 1\n' +
  '            ) {\n' +
  '            } else if (element.localName !== \'slot\')\n' +
  '                processed += this.process(child, fw, prefix)\n' +
  '        }\n' +
  '        processed +=\n' +
  '            element.localName === \'ucp-example\'\n' +
  '                ? \'\'\n' +
  '                : element.localName.startsWith(`${prefix}-`)\n' +
  '                    ? `</${this.camelize(element.localName, fw)}>`\n' +
  '                    : `</${element.localName}>`\n' +
  '        return processed.trim()\n' +
  '    }\n' +
  '\n' +
  '    render(framework, prefix) {\n' +
  '        try {\n' +
  '            const code = this.process(this, framework, prefix)\n' +
  '            this.shadowRoot.innerHTML = `<ucp-example-implementation code="${window.btoa(\n' +
  '                code\n' +
  '            )}"><slot></slot></ucp-example-implementation>`\n' +
  '        } catch (e) {\n' +
  '            const context = this\n' +
  '            setTimeout(() => {\n' +
  '                context.render(framework, prefix)\n' +
  '            }, 5)\n' +
  '        }\n' +
  '    }\n' +
  '\n' +
  '    constructor() {\n' +
  '        super()\n' +
  '\n' +
  '        let framework = document.createElement(\'template\')\n' +
  '        framework.innerHTML = `<div x-init="$dispatch(\'update\', {framework, prefix})"></div>`\n' +
  '        this.addEventListener(\'update\', (ev) => {\n' +
  '            this.render(ev.detail.framework, ev.detail.prefix)\n' +
  '        })\n' +
  '        this.attachShadow({mode: \'open\'})\n' +
  '        this._contents = new DocumentFragment()\n' +
  '        this._contents.appendChild(framework.content.cloneNode(true))\n' +
  '    }\n' +
  '\n' +
  '    connectedCallback() {\n' +
  '        this.appendChild(this._contents)\n' +
  '    }\n' +
  '}\n' +
  '\n' +
  'window.customElements.define(\'ucp-example\', Example)\n'
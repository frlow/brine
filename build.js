import esbuild from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import path from 'path'
import fs from 'fs'

export const kebabize = (str) =>
    str
        .split('')
        .map((letter, idx) => {
            return letter.toUpperCase() === letter
                ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
                : letter
        })
        .join('')

const buildAgainPlugin = (entryPoints) => ({
    name: 'build-again-plugin',
    setup(build) {
        if (build.initialOptions.format !== "esm") throw "Format must be esm"
        if (!build.initialOptions.splitting) throw "Splitting must be enabled"
        build.onEnd(async (args) => {
            await esbuild.build({
                entryPoints: entryPoints,
                format: 'esm',
                outdir: 'dist',
                bundle: true,
                sourcemap: true,
                splitting: true,
                minify: true,
                loader: {
                    '.css': 'text',
                },
            })
        })
    },
})

const svelteFiles = ['examples/svelte/SvelteApp.svelte']
const vueFiles = ['examples/vue/VueApp.vue']
const reactFiles = ['examples/react/ReactApp.tsx']

const getEntryPoints = (components) => components.map(c => {
    const parsed = path.parse(c)
    return path.join(parsed.dir, parsed.name + '.ts')
})
const getCeEntryPoints = wrappers => wrappers.map(w => {
    const parsed = path.parse(w)
    return path.join(parsed.dir, parsed.name + '.ce.js')
})

const generateCeFiles = (components, from, to, wrapperSrc, prefix) => {
    for (const component of components) {
        const source = component.replace(from, to)
        const relative = path.parse(path.relative(path.parse(component).dir, source))
        const target = path.join(relative.dir, relative.name)
        const wrapper = path.relative(path.parse(component).dir, wrapperSrc)
        const tag = prefix + '-' + kebabize(relative.name)
        const code = `import { createWrapper } from '${wrapper}'
import app from '${target}'
import style from '${target}.css'
customElements.define('${tag}', createWrapper(app, style))`
        const parsedComponent = path.parse(component)
        const ceFilePath = path.join(parsedComponent.dir, parsedComponent.name + '.ce.js')
        fs.writeFileSync(ceFilePath, code, 'utf8')
    }
}

const entryPoints = getEntryPoints([...svelteFiles, ...vueFiles, ...reactFiles]).concat('examples/vanilla/Vanilla.ts')
generateCeFiles(entryPoints, "examples", "dist", "src/wrapper")
const ceEntryPoints = getCeEntryPoints(entryPoints)
const run = async (watch) => {
    await esbuild.build({
        entryPoints,
        format: 'esm',
        outdir: 'dist',
        bundle: true,
        sourcemap: true,
        splitting: true,
        define: {'process.env.NODE_ENV': '"production"'},
        watch,
        plugins: [
            vuePlugin(),
            sveltePlugin({
                preprocess: [sveltePreprocess()],
            }),
            buildAgainPlugin(ceEntryPoints),
        ],
    })
}

const watch = process.argv[2] === "watch"
run(watch).then()

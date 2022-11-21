import esbuild from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'

const buildAgainPlugin = (entryPoints) => ({
    name: 'build-gain-plugin',
    setup(build) {
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

const svelteFiles = ['examples/svelte/index.ts']
const vueFiles = ['examples/vue/index.ts']
const reactFiles = ['examples/react/index.ts']

const run = async () => {
    await esbuild.build({
        entryPoints: [
            'examples/vanilla/index.ts',
            ...reactFiles,
            ...vueFiles,
            ...svelteFiles
        ],
        format: 'esm',
        outdir: 'dist',
        bundle: true,
        sourcemap: true,
        splitting: true,
        define: {'process.env.NODE_ENV': '"production"'},
        watch: true,
        plugins: [
            vuePlugin(),
            sveltePlugin({
                preprocess: [sveltePreprocess()],
            }),
            buildAgainPlugin([
                'examples/vanilla/element.js',
                'examples/vue/element.js',
                'examples/svelte/element.js',
                'examples/react/element.js',
            ]),
        ],
    })
}

run().then()

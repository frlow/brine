const importES = async (name) =>
    await import(name)

const importMdx = async () => (await importES("@mdx-js/esbuild")).default

module.exports = {importMdx, importES}

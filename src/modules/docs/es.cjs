const importMdx = async () => (await import("@mdx-js/esbuild")).default

module.exports = {importMdx}

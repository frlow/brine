export const brineSveltePreprocessor = {
  markup: async ({ content }: { content: string }) => {
    const props = content
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => /export let .*?:/.test(l))
      .map((l) => l.match(/export let(.*?):/)[1].trim())
    return {
      code: `${content}
<script context="module">
export const __props = [${props.map((p) => `'${p}'`).join(',')}] 
</script>`,
    }
  },
}

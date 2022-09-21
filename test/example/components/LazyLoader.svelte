<script lang="ts">
  type Mode = 'rendered' | 'hover'
  export let mode: Mode = 'rendered'
  export let name: string
  let primed = true
  const lazyLoad = async (changedMode: Mode) => {
    if (changedMode === mode && name && primed) {
      const overrides = JSON.parse(localStorage.getItem("lazy-overrides") || '{}')
      const lazyLoadFunc: (name: string) => Promise<string> = (window as any).lazyLoad || ((name) => {
        console.log(`window.lazyLoad function not set, could not lazy load ${name}`)
        return `http://localhost:3000/${name}.js`
      })
      const target = overrides[name] || await lazyLoadFunc(name)
      primed = false
      await import(target)
    }
  }
  $:{
    if (name) lazyLoad('rendered')
  }
</script>

<div on:mouseover={()=>lazyLoad('hover')}>
    <slot></slot>
</div>

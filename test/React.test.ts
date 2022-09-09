// describe('React specific problems', () => {
//   test('React callback', async () => {
//     const code = `import React from 'react'
// import { createRoot } from 'react-dom/client'
// import { SvelteEmits } from './dist/wrapper/react'
// const App = () => {
//     const [count, setCount] = React.useState(0)
//     return <>
//         <SvelteEmits onClick={()=>setCount(count+1)}>Increment</SvelteEmits>
//         <div>{count}</div>
//     </>
// }
// const container = document.getElementById('app')
// const root = createRoot(container!)
// root.render(<App />)
// ${loadedSnippet}
// `
//     const plugins: esbuild.Plugin[] = [fakeFilePlugin(/rootapp\.tsx/, code)]
//     const result = await esbuild.build({
//       entryPoints: [path.join('test', 'rootapp.tsx')],
//       bundle: true,
//       format: 'iife',
//       sourcemap: false,
//       outdir: 'dist',
//       write: false,
//       plugins: plugins,
//     })
//     const testApp = result.outputFiles[0].text
//     await manualWrapper(testApp)
//     for (let i = 0; i < 4; i++) {
//       await page.evaluate(() =>
//         document.getElementById('app')!.firstElementChild!.dispatchEvent(
//           new CustomEvent('ex-click', {
//             detail: [],
//             bubbles: true,
//           })
//         )
//       )
//       await new Promise((r) => setTimeout(() => r(''), 5))
//     }
//     const text = await page.evaluate(
//       () => document.getElementById('app')!.children[1].textContent
//     )
//     expect(text).toEqual('4')
//   })
// })

export const getDocsExample = (prefix: string) => {
  const docsExample = `import React from 'react'
export const DocsExampleInternal = ({children, code, info}:any)=>{
    return <${prefix}-docs-example info={JSON.stringify(info)} code={JSON.stringify(code)} className="example">
  <div className="example-content">
    {children}
  </div>
  <div className="example-code" slot="code">
    {Object.keys(code).map(key=><div key={key} className={'example-code-'+key}>
      <label>{key}</label>
      <div >{code[key]}</div>
    </div>)}
  </div>
</${prefix}-docs-example>
}`
  return docsExample
}

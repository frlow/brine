import type Mdx from '@mdx-js/esbuild'

export declare function importES<T>(name: string): Promise<T>

export declare function importMdx(): Promise<typeof Mdx>

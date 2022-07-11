export type Options = {
  /**
   * Vue's options API is enabled by default, but it can be disabled in order to save space.
   */
  disableOptionsApi?: boolean

  /**
   * Enable Vue dev tools on production, disabled by default.
   */
  enableDevTools?: boolean

  /**
   * If enabled, Vue will emit code for rendering SSR pages.
   */
  renderSSR?: boolean

  /**
   * @deprecated Use pathAliases instead.
   */
  disableResolving?: boolean

  /**
   * By default, the plugin will resolve paths matching any of the entries in the tsconfig.json "paths" setting.
   * If this option is set to false, this behaviour will be disabled. If it is set to an object,
   * it will use those entries instead of those found in the tsconfig.json file.
   */
  pathAliases?: false | Record<string, string>

  /**
   * Strategy to use when generating IDs for components.
   *
   * If set to "hash", the ID will be derived from the .vue file path.
   * If set to an object with a "random" property, a random ID will be generated.
   * If "random" is set to a string, the random generator will be seeded with said string.
   */
  scopeId?: 'hash' | { random: true | string }

  /**
   * Disable the caching of rendered SFC parts.
   */
  disableCache?: boolean

  /**
   * Options and plugins to pass to the PostCSS postprocessor.
   */
  postcss?: {
    options?: any
    plugins?: any[]
  }
}

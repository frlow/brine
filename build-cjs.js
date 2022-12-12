import esbuild from 'esbuild'

esbuild
  .build({
    bundle: true,
    entryPoints: ['src/build/index.ts'],
    platform: 'node',
    outfile: 'lib/build/index.cjs',
    external: [
      'ect',
      'mote',
      'toffee',
      'dot',
      'twing',
      'squirrelly',
      'coffee-script',
      'marko',
      'slm',
      'vash',
      'plates',
      'babel-core',
      'htmling',
      'teacup',
      'ractive',
      'bracket-template',
      'just',
      'mustache',
      'walrus',
      'lodash',
      'templayed',
      'handlebars',
      'hogan.js',
      'underscore',
      'haml-coffee',
      'eco',
      'jazz',
      'whiskers',
      'hamlet',
      'hamljs',
      'jqtpl',
      'ejs',
      'twig',
      'liquor',
      'velocityjs',
      'dustjs-linkedin',
      'atpl',
      'string-replace-source-map',
    ],
  })
  .then()

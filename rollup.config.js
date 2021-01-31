import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const banner = `/*!
 * vue2-validus v${pkg.version}
 * Copyright (c) ${new Date().getFullYear()} Josh Gamble
 * @license MIT
 */`

const typescriptPlugin = typescript({
  tsconfig: './tsconfig.json',
  clean: true,
  useTsconfigDeclarationDir: true
})

function createEntries(configs) {
  return configs.map(c => createEntry(c))
}

function createEntry(config) {
  const c = {
    input: config.input,
    plugins: [],
    output: {
      banner, 
      file: config.file, 
      format: config.format
    },
    external: ['vue', '@vue/composition-api'],
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  if (config.format === 'umd') {
    c.output.name = c.output.name || 'vue2-validus'
    c.output.globals = { 
      'vue': 'vue',
      '@vue/composition-api': 'VueCompositionApi'
    }
  }

  c.plugins.push(resolve())
  c.plugins.push(commonjs())
  c.plugins.push(typescriptPlugin)

  if (config.minify) {
    c.plugins.push(terser({ module: config.format === 'es' }))
  }

  return c
}

// CommonJS (for Node)
// ES module (for bundlers)
// UMD (for browser)
export default createEntries([
  { input: 'src/index.ts', file: pkg.main, format: 'cjs' },
  { input: 'src/index.ts', file: pkg.module, format: 'es' }
  // { input: 'src/index.ts', file: pkg.browser, format: 'umd' }
])

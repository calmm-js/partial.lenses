import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const build = ({NODE_ENV, format, file}) => ({
  external: ['infestines'],
  input: 'src/partial.lenses.js',
  output: {
    globals: {infestines: 'I'},
    name: 'L',
    format,
    file
  },
  plugins: [
    NODE_ENV && replace({'process.env.NODE_ENV': JSON.stringify(NODE_ENV)}),
    nodeResolve({modulesOnly: true}),
    babel(),
    NODE_ENV === 'production' &&
      uglify({
        compress: {
          hoist_funs: true,
          passes: 3,
          pure_getters: true,
          pure_funcs: ['require']
        }
      })
  ].filter(x => x)
})

export default [
  build({format: 'cjs', file: 'dist/partial.lenses.cjs.js'}),
  build({format: 'es', file: 'dist/partial.lenses.es.js'}),
  build({format: 'umd', file: 'dist/partial.lenses.js', NODE_ENV: 'dev'}),
  build({
    format: 'umd',
    file: 'dist/partial.lenses.min.js',
    NODE_ENV: 'production'
  })
]

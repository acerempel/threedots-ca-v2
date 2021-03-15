import resolve from '@rollup/plugin-node-resolve';
import replace from "@rollup/plugin-replace";
import commonjs from '@rollup/plugin-commonjs';
import sucrase from '@rollup/plugin-sucrase';

const production = process.env.NODE_ENV === 'production';

const replaceOptions = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  preventAssignment: true,
};

export default (async () => { return {
  input: 'resources/js/main.ts',
  output: {
    file: 'public/js/main.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    commonjs(),
    replace(replaceOptions),
    sucrase({ include: "resources/js/*", transforms: ['typescript'] }),
    production && (await import('rollup-plugin-terser')).terser({ ecma: 2017 })
  ]
} })();

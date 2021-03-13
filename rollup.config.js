import resolve from '@rollup/plugin-node-resolve';
import replace from "@rollup/plugin-replace";
import commonjs from '@rollup/plugin-commonjs';

const production = process.env.NODE_ENV === 'production';

const replaceOptions = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  preventAssignment: true,
};

export default (async () => { return {
  input: 'resources/js/main.js',
  output: {
    file: 'public/js/main.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    commonjs(),
    replace(replaceOptions),
    production && (await import('rollup-plugin-terser')).terser({ ecma: 2017 })
  ]
} })();

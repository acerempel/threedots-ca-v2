import resolve from '@rollup/plugin-node-resolve';
import replace from "@rollup/plugin-replace";

const production = process.env.NODE_ENV === 'production';

export default (async () => { return {
  input: 'resources/js/main.js',
  output: {
    file: 'public/js/main.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    replace({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
    production && (await import('rollup-plugin-terser').terser({ ecma: 2017 }))
  ]
} })();

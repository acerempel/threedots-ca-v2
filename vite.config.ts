import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { laravel } from "vite-plugin-laravel";
import purge from '@fullhuman/postcss-purgecss'
import purgeFromHtml from 'purgecss-from-html'

export default defineConfig({
  plugins: [
    solidPlugin(),
    laravel(),
  ],
  css: {
    postcss: [purgeCSS],
  },
});

const additionalCSSclasses = [
  // Classes applied via JS
  'colour-scheme-auto', 'colour-scheme-light', 'colour-scheme-dark',
  'visible', 'invisible',
  'fonts-default', 'aria-current', 'mt-1/8',
  // Markup from Bard
  'strong', 'em',
  // Classes from blueprint
  'grid-col-auto',
  'grid-col-first',
  'grid-col-last',
  'grid-col-all',
  'justify-self-start',
  'justify-self-end',
  'justify-self-center',
  'justify-self-stretch',
];

const purgeCSS = purge({
  content: [`./resources/views/**/*.antlers.html`, `./resources/views/**/*.blade.php`, `./resources/js/**/*.tsx`],
  extractors: [{extractor: purgeFromHtml, extensions: ['html']}],
  safelist: additionalCSSclasses,
});

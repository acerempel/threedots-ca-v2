const mix = require('laravel-mix');
require('laravel-mix-versionhash');

const production = process.env.NODE_ENV === 'production' || mix.inProduction();

const additionalCSSclasses = [
  // Classes applied via JS
  'colour-scheme-auto', 'colour-scheme-light', 'colour-scheme-dark',
  'visible', 'invisible',
  'fonts-default', 'mt-1/8',
  // Markup from Bard
  'strong', 'em',
];

const purgeCSS = require('@fullhuman/postcss-purgecss')({
  content: [`./resources/views/**/*.antlers.html`],
  extractors: [ { extractor: require('purgecss-from-html'), extensions: ['html'] } ],
  safelist: additionalCSSclasses,
});

const mixOptions = {
  terser: { terserOptions: { ecma: '2017' } },
  cssNano: production && { preset: 'default' },
  autoprefixer: production && { flexbox: false },
  postCss: production ? [ purgeCSS ] : [],
};

const mixed = mix
  .ts('resources/js/main.ts', 'js/main.js')
  .sass('resources/sass/main.scss', 'css/main.css')
  .options(mixOptions);

if (production) mixed.versionHash();

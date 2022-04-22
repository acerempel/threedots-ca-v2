const mix = require('laravel-mix');
require('laravel-mix-versionhash');

const production = process.env.NODE_ENV === 'production' || mix.inProduction();

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

function purgeCSS() {
  return require('@fullhuman/postcss-purgecss')({
    content: [`./resources/views/**/*.antlers.html`],
    extractors: [{extractor: require('purgecss-from-html'), extensions: ['html']}],
    safelist: additionalCSSclasses,
  });
}


const mixOptions = {
  terser: { terserOptions: { ecma: '2017' } },
  cssNano: production && { preset: 'default' },
  autoprefixer: production && { flexbox: false },
  postCss: production ? [ purgeCSS() ] : [],
};

mix
  .ts('resources/js/main.ts', 'assets/web/main.js')
  .sass('resources/sass/main.scss', 'assets/web/main.css')
  .override((webpackConfig) => {
    const outputConfig = {
      module: true,
      chunkLoading: 'import',
      chunkFormat: 'module',
      library: {
        type: 'module',
      },
    }
    webpackConfig.output = Object.assign(webpackConfig.output || {}, outputConfig)
    webpackConfig.experiments = { outputModule: true, }
  })
  .sourceMaps()
  .options(mixOptions);

if (production) mix.versionHash();

if (process.env.DEBUG) mix.dump();

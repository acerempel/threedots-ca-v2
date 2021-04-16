const public = process.env.PUBLIC_DIR;

module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: [`./${public}/**/*.html`],
      extractors: [ { extractor: require('purgecss-from-html'), extensions: ['html'] } ],
      safelist: ['colour-scheme-auto', 'colour-scheme-light', 'colour-scheme-dark', 'visible', 'invisible'],
    }),
    require('cssnano')({ preset: 'default' }),
    require('autoprefixer')({ flexbox: false }),
  ],
};

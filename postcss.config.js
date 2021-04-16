const public = process.env.PUBLIC_DIR;

const additionalCSSclasses = [
  'colour-scheme-auto', 'colour-scheme-light', 'colour-scheme-dark',
  'visible', 'invisible',
  'fonts-default',
];

module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: [`./${public}/**/*.html`],
      extractors: [ { extractor: require('purgecss-from-html'), extensions: ['html'] } ],
      safelist: additionalCSSclasses,
    }),
    require('cssnano')({ preset: 'default' }),
    require('autoprefixer')({ flexbox: false }),
  ],
};

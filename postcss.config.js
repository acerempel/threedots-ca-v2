const public = process.env.PUBLIC_DIR;

module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: [`./${public}/**/*.html`],
      extractors: [ { extractor: require('purgecss-from-html'), extensions: ['html'] } ]
    }),
    require('cssnano')({ preset: 'default' }),
    require('autoprefixer')({ flexbox: false }),
  ],
};

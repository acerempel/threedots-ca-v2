import { defineConfig, loadEnv, UserConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { laravel } from "vite-plugin-laravel";

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

const purgeCSS = async () => (await import('@fullhuman/postcss-purgecss')).default({
  content: [`./resources/views/**/*.antlers.html`, `./resources/views/**/*.blade.php`, `./resources/js/**/*.tsx`],
  extractors: [
    {extractor: (await import('purgecss-from-html')).default, extensions: ['html', 'php', 'tsx']},
    {extractor: (await import('@fullhuman/purgecss-from-tsx')).default({tsOptions: await import('./package.json')}), extensions: ['tsx']},
  ],
  safelist: additionalCSSclasses,
});

export default defineConfig(async ({command, mode}) => {
  const config = {
    plugins: [
      solidPlugin(),
      laravel(),
    ],
    css: {
      postcss: { plugins: [] }
    },
  }
  if (command === 'build') {
    config.css.postcss.plugins.push(await purgeCSS())
  } else if (command === 'serve') {
    const postCssUrl = (await import('postcss-url')).default
    const baseUrl = loadEnv(mode, process.cwd(), 'APP_').APP_URL
    const rewriteUrl = ({url}) => {
      if (url.endsWith('.woff2') && url.startsWith('/') && !url.startsWith('//')) {
        return new URL(url, baseUrl).href
      } else {
        return url
      }
    }
    config.css.postcss.plugins.push(postCssUrl({url: rewriteUrl}))
  }
  return config
});

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://carrietheswiss.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (p) => !p.endsWith('/404/') && !p.includes('/beta/') && !p.includes('/checklist/') })],   // the cheat sheet is the newsletter's thank-you (noindex)
});

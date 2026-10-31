import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://carrietheswiss.sk',
  trailingSlash: 'always',
  build: { format: 'directory' },
});

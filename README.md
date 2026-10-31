# Carrie the Swiss — website

Astro static site, deployed on Cloudflare Pages.

- `npm install` · `npm run dev` · `npm run build` (output: `dist/`)
- Texts: `src/i18n/<lang>.json` (missing keys fall back to `en.json`). Add a language: add the JSON file and its code to `LOCALES` in `src/i18n/index.ts`.
- Episodes: `src/data/episodes.ts`
- Film for the scroll hero: `public/assets/film/film.mp4` (desktop), `film-mobile.mp4`, `poster.jpg` — each file under 25 MB (Cloudflare Pages limit).

Cloudflare Pages settings: framework preset **Astro**, build command `npm run build`, output directory `dist`.

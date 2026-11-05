// Prints the cheat sheet "10 questions for the breeder" to one A4 PDF per language, into public/assets/pdf/.
// Run after a build, with the site served locally:  npx astro build && npx astro preview --port 4321
//                                                   node scripts/checklist-pdfs.cjs [http://127.0.0.1:4321]
// Then build again so the PDFs land in dist/. Every PDF must stay one page (the script stops if not).
const { chromium } = require('playwright');
const { mkdirSync, statSync } = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const BASE = process.argv[2] || 'http://127.0.0.1:4321';
const LANGS = ['en', 'sk', 'cs', 'de', 'pl', 'fr', 'it', 'es', 'uk', 'hu', 'nl'];
const OUT = path.join(__dirname, '..', 'public', 'assets', 'pdf');

(async () => {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let bad = 0;
  for (const l of LANGS) {
    await page.goto(`${BASE}/${l}/checklist/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(OUT, `carrie-10-questions-${l}.pdf`);
    await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true });
    let pages = '?';
    try { pages = execFileSync('pdfinfo', [file]).toString().match(/Pages:\s+(\d+)/)[1]; } catch { /* pdfinfo missing */ }
    if (pages !== '1' && pages !== '?') bad++;
    console.log(`${l}  ${pages} page(s)  ${(statSync(file).size / 1024).toFixed(0)} KB`);
  }
  await browser.close();
  if (bad) { console.error(`${bad} PDF(s) longer than one page: tighten the print CSS in src/pages/[lang]/checklist.astro`); process.exit(1); }
})();

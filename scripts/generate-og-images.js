// Renders one 1200x630 share image per marathon into public/og/marathons/.
//
// Deliberately NOT part of `npm run build`. It needs Playwright and a headless
// browser, and putting that in the deploy path would add minutes and a large
// dependency to every Vercel and Actions build for images that change only
// when a race is added. The output is committed instead, and a test fails if a
// race has no image, so the two cannot silently drift.
//
// Run it after adding a race:
//   node scripts/generate-og-images.js
//
// Requires Playwright. It is not a project dependency, so this resolves it
// from wherever it happens to be installed and says so plainly if it is not.

const fs = require('fs');
const path = require('path');
const Module = require('module');
const babel = require('@babel/core');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'og', 'marathons');

const loadModule = (file) => {
  const { code } = babel.transformFileSync(file, {
    presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    babelrc: false,
    configFile: false,
  });
  const mod = new Module(file);
  mod.filename = file;
  mod.paths = Module._nodeModulePaths(path.dirname(file));
  const nativeRequire = mod.require.bind(mod);
  mod.require = (request) =>
    request.startsWith('.')
      ? loadModule(require.resolve(path.resolve(path.dirname(file), request), { paths: [path.dirname(file)] }))
      : nativeRequire(request);
  mod._compile(code, file);
  return mod.exports;
};

const requirePlaywright = () => {
  const candidates = [
    'playwright',
    '/opt/node22/lib/node_modules/playwright',
    path.join(ROOT, 'node_modules', 'playwright'),
  ];
  for (const c of candidates) {
    try {
      return require(c);
    } catch (e) {
      /* try the next one */
    }
  }
  console.error(
    'generate-og-images: Playwright not found. Install it (npm i -D playwright) and rerun.'
  );
  process.exit(1);
};

const { MARATHONS } = loadModule(path.join(ROOT, 'src/marathons.js'));
const { themeForIndex } = loadModule(path.join(ROOT, 'src/raceTheme.js'));

const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Same four abstract motifs as the in-page hero, scaled up. Arcs and dots
// only: nothing a reader could mistake for a course elevation profile.
const motif = (i) =>
  [
    `<g fill="none" stroke="#fff" stroke-width="4"><circle cx="1020" cy="-40" r="200"/><circle cx="1020" cy="-40" r="310"/><circle cx="1020" cy="-40" r="420"/><circle cx="1020" cy="-40" r="530"/></g>`,
    `<g fill="#fff">${Array.from({ length: 9 }, (_, r) =>
      Array.from({ length: 12 }, (_, c) => `<circle cx="${760 + c * 42}" cy="${60 + r * 62}" r="6"/>`).join('')
    ).join('')}</g>`,
    `<g fill="none" stroke="#fff" stroke-width="4">${Array.from(
      { length: 11 },
      (_, i2) => `<path d="M${700 + i2 * 62} 690 L${920 + i2 * 62} -60"/>`
    ).join('')}</g>`,
    `<g fill="none" stroke="#fff" stroke-width="4"><rect x="800" y="-90" width="360" height="360" rx="78"/><rect x="866" y="-24" width="360" height="360" rx="78"/><rect x="932" y="42" width="360" height="360" rx="78"/></g>`,
  ][i];

const card = (race, theme) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;position:relative;overflow:hidden;
 font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif}
svg.bg{position:absolute;inset:0}
.in{position:relative;padding:78px 84px;height:100%;display:flex;flex-direction:column;justify-content:center;color:#fff}
.where{font-size:26px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.82)}
h1{font-size:78px;line-height:1.06;letter-spacing:-.02em;margin:20px 0 0;max-width:15ch}
.profile{font-size:31px;margin-top:24px;color:rgba(255,255,255,.92)}
.brand{position:absolute;left:84px;bottom:56px;display:flex;align-items:center;gap:14px;
 font-size:25px;font-weight:650;color:rgba(255,255,255,.9)}
</style></head><body>
<svg class="bg" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${theme.base}"/><stop offset="1" stop-color="${theme.deep}"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/><g opacity="0.16">${motif(theme.motif)}</g></svg>
<div class="in">
  <div class="where">${esc(race.city)}, ${esc(race.country)} &middot; ${esc(race.month)}</div>
  <h1>Pacing the ${esc(race.name)}</h1>
  <div class="profile">${esc(race.profile)}</div>
</div>
<div class="brand">
  <svg width="34" height="34" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#fff" fill-opacity="0.9"/><rect x="234" y="116" width="44" height="52" rx="12" fill="${theme.deep}"/><circle cx="256" cy="302" r="132" fill="none" stroke="${theme.deep}" stroke-width="40"/><path d="M256 302 L330 228" fill="none" stroke="${theme.deep}" stroke-width="36" stroke-linecap="round"/></svg>
  racepacepro.com
</div>
</body></html>`;

const main = async () => {
  const { chromium } = requirePlaywright();
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  for (let i = 0; i < MARATHONS.length; i += 1) {
    const race = MARATHONS[i];
    await page.setContent(card(race, themeForIndex(i)), { waitUntil: 'load' });
    // JPEG, not PNG. These are smooth gradients, which PNG stores appallingly:
    // the first run produced 6.6 MB across 22 files, around 300 KB each. At
    // quality 88 the same images are a fraction of that with no visible
    // difference, and every platform that reads og:image accepts JPEG.
    await page.screenshot({ path: path.join(OUT, `${race.id}.jpg`), type: 'jpeg', quality: 88 });
  }

  await browser.close();

  const total = fs.readdirSync(OUT).reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
  console.log(
    `generate-og-images: wrote ${MARATHONS.length} images, ${(total / 1024).toFixed(0)} KB total`
  );
};

main();

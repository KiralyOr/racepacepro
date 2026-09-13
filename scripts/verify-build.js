// Serves build/ and crawls it in a real browser, at a domain root and at a
// subpath, checking the things unit tests cannot see.
//
// Deliberately NOT part of `npm run build`. It needs Playwright and a headless
// browser, which do not belong in the deploy path. Run it before shipping
// anything that touches the generator, the navigation or the page layout:
//
//   node scripts/verify-build.js
//
// It has earned its place. Over the course of building this site it caught a
// header that jumped between the home page and generated pages, links that
// resolved at a domain root and 404d on the GitHub Pages copy, and a nav that
// rendered on one page type and not the other. None of those fail a unit test.

const http = require('http');
const fs = require('fs');
const path = require('path');

const BUILD = path.join(__dirname, '..', 'build');
const NAV = ['Calculator', 'Pace charts', 'Predictor', 'Marathons', 'Guides'];

const PAGES = [
  '', 'pace/', 'guides/', 'predictor/', 'marathons/',
  'marathons/berlin/', 'marathons/athens/',
  'pace/marathon/', 'pace/sub-3-30-marathon/', 'guides/marathon-goal-time/',
];

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.json': 'application/json', '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const requirePlaywright = () => {
  for (const c of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
    try {
      return require(c);
    } catch (e) {
      /* try the next */
    }
  }
  console.error('verify-build: Playwright not found. Install it (npm i -D playwright).');
  process.exit(1);
};

const serve = (prefix, port) => {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    if (prefix && !url.startsWith(prefix)) {
      res.writeHead(404);
      return res.end();
    }
    let file = path.join(BUILD, prefix ? url.slice(prefix.length) : url);
    if (file.endsWith('/')) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const alt = path.join(file, 'index.html');
      if (!fs.existsSync(alt)) {
        res.writeHead(404);
        return res.end();
      }
      file = alt;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
};

const checkContext = async (browser, prefix, port) => {
  const server = await serve(prefix, port);
  const base = `http://localhost:${port}${prefix}/`;
  const problems = [];

  for (const slug of PAGES) {
    const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });
    const failed = [];
    page.on('requestfailed', (r) => failed.push(r.url()));
    page.on('response', (r) => !r.ok() && failed.push(`${r.status()} ${r.url()}`));

    const label = `${prefix || 'root'} ${slug || '/'}`;
    const resp = await page.goto(base + slug, { waitUntil: 'networkidle' });
    if (!resp.ok()) problems.push(`${label}: HTTP ${resp.status()}`);

    for (const href of [...new Set(await page.$$eval('a[href]', (as) => as.map((a) => a.href)))]) {
      if (!href.startsWith(`http://localhost:${port}`)) continue;
      const r = await page.request.get(href);
      if (!r.ok()) problems.push(`${label}: broken link ${href} (${r.status()})`);
    }

    const nav = await page.$$eval('nav[aria-label="Site"] a', (as) =>
      as.map((a) => a.textContent.trim())
    );
    if (JSON.stringify(nav) !== JSON.stringify(NAV)) problems.push(`${label}: nav is ${JSON.stringify(nav)}`);

    const current = await page.$$eval('nav[aria-label="Site"] a[aria-current]', (as) => as.length);
    if (current > 1) problems.push(`${label}: ${current} nav items marked current`);

    const h1s = await page.$$eval('h1', (n) => n.length);
    if (h1s !== 1) problems.push(`${label}: ${h1s} h1 elements`);

    for (const width of [900, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const scrolls = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      if (scrolls) problems.push(`${label}: horizontal scroll at ${width}px`);
    }

    // The Vercel analytics endpoint only exists on Vercel, so it 404s here by
    // design. Anything else failing is a real broken asset.
    const real = failed.filter((u) => !u.includes('/_vercel/insights/'));
    if (real.length) problems.push(`${label}: failed requests ${real.join(' | ')}`);

    await page.close();
  }

  server.close();
  return problems;
};

const main = async () => {
  if (!fs.existsSync(BUILD)) {
    console.error('verify-build: build/ not found. Run npm run build first.');
    process.exit(1);
  }
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();

  const problems = [
    ...(await checkContext(browser, '', 8788)),
    // The GitHub Pages copy is served from a subpath, where any absolute
    // internal path silently breaks.
    ...(await checkContext(browser, '/racepacepro', 8789)),
  ];

  await browser.close();

  console.log(`verify-build: checked ${PAGES.length} pages at a domain root and at a subpath`);
  if (problems.length) {
    console.error(`verify-build: ${problems.length} problems\n  - ${problems.join('\n  - ')}`);
    process.exit(1);
  }
  console.log('verify-build: no problems');
};

main();

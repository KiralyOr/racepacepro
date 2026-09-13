/* eslint-disable */
// Renders the static SEO pages into build/ after Create React App has run.
//
// The point of these pages is that a crawler sees real content, so they are
// written as plain HTML rather than mounted by React. The app itself is
// client-rendered and would serve an empty div. Page maths comes from the same
// src/paceMath.js the app uses, loaded here through Babel so there is no second
// implementation to drift.

const fs = require('fs');
const path = require('path');
const Module = require('module');
const babel = require('@babel/core');

const ROOT = path.join(__dirname, '..');
const BUILD = path.join(ROOT, 'build');

const moduleCache = new Map();

const loadModule = (request) => {
  const filename = require.resolve(request);
  if (moduleCache.has(filename)) return moduleCache.get(filename);

  const { code } = babel.transformFileSync(filename, {
    presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    babelrc: false,
    configFile: false,
  });

  const mod = new Module(filename, null);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  const nodeRequire = mod.require.bind(mod);
  mod.require = (spec) =>
    spec.startsWith('.') ? loadModule(path.resolve(path.dirname(filename), spec)) : nodeRequire(spec);

  mod._compile(code, filename);
  moduleCache.set(filename, mod.exports);
  return mod.exports;
};

const { formatClock, formatPace } = loadModule(path.join(ROOT, 'src/paceMath.js'));
const { RACES, SITE_ORIGIN, allPages, hubPage } = loadModule(path.join(ROOT, 'src/pageData.js'));
const { ARTICLES } = loadModule(path.join(ROOT, 'src/articles.js'));
const { MARATHONS } = loadModule(path.join(ROOT, 'src/marathons.js'));
const { ABOUT, FAQ } = loadModule(path.join(ROOT, 'src/homeContent.js'));
const { analyticsHtml } = loadModule(path.join(ROOT, 'src/analytics.js'));
const { PREDICTOR_PAGE, predictorTables } = loadModule(path.join(ROOT, 'src/predictorData.js'));

// Relative rather than absolute so pages work wherever the site is served
// from, including a subpath such as the GitHub Pages copy. The depth varies:
// pace/<slug>/ is two levels down, marathons/ is one.
const relFor = (slug) => '../'.repeat(slug.split('/').length);

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

const STYLES = `
*{box-sizing:border-box}
body{margin:0;background:#f8fafc;color:#0f172a;line-height:1.55;
 font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif}
a{color:#1d4ed8}
.bar{background:#fff;border-bottom:1px solid #e2e8f0}
.bar .in{max-width:44rem;margin:0 auto;padding:14px 16px;display:flex;align-items:center;gap:10px}
.bar svg{width:26px;height:26px}
.bar b{font-size:16px;letter-spacing:-.01em}
.bar a{color:#0f172a;text-decoration:none;display:flex;align-items:center;gap:10px}
main{max-width:44rem;margin:0 auto;padding:24px 16px 40px}
.crumb{font-size:13px;color:#64748b;margin-bottom:14px}
.crumb a{color:#64748b}
h1{font-size:28px;line-height:1.2;letter-spacing:-.02em;margin:0 0 10px}
h2{font-size:17px;margin:0 0 10px}
p{margin:0 0 12px;color:#475569;font-size:15px}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px;margin:16px 0;
 box-shadow:0 1px 2px rgba(0,0,0,.04)}
.hero{background:#0f172a;color:#fff;border-radius:14px;padding:22px;text-align:center;margin:18px 0}
.hero .k{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#94a3b8}
.hero .v{font-size:42px;font-weight:650;margin:4px 0 0;font-variant-numeric:tabular-nums}
.hero .m{font-size:14px;color:#94a3b8;margin-top:6px}
.pill{display:inline-block;margin-top:10px;padding:4px 12px;border-radius:999px;
 font-size:12px;font-weight:650}
.grid{display:grid;gap:16px}
@media(min-width:640px){.grid.two{grid-template-columns:1fr 1fr}}
table{width:100%;border-collapse:collapse;font-size:14px}
th{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#64748b;
 text-align:left;padding:0 4px 8px;font-weight:650}
th.r,td.r{text-align:right}
td{padding:7px 4px;border-top:1px solid #f1f5f9;color:#334155;font-variant-numeric:tabular-nums}
tr.fin td{color:#1d4ed8;font-weight:650}
.cta{display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:600;
 font-size:15px;padding:11px 20px;border-radius:10px}
.links{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.links a{font-size:14px;text-decoration:none;border:1px solid #e2e8f0;background:#fff;
 border-radius:999px;padding:6px 14px;color:#334155}
.lede{font-size:17px;color:#334155;margin-bottom:18px}
ul{margin:0 0 12px;padding-left:20px;color:#475569;font-size:15px}
li{margin-bottom:7px}
footer{border-top:1px solid #e2e8f0;background:#fff;margin-top:32px}
footer .in{max-width:44rem;margin:0 auto;padding:20px 16px;font-size:13px;color:#64748b}
`;

const LOGO = `<svg viewBox="0 0 512 512" aria-hidden="true"><rect width="512" height="512" rx="112" fill="#2563eb"/><rect x="234" y="116" width="44" height="52" rx="12" fill="#fff"/><circle cx="256" cy="302" r="132" fill="none" stroke="#fff" stroke-width="40"/><path d="M256 302 L330 228" fill="none" stroke="#fff" stroke-width="36" stroke-linecap="round"/></svg>`;

const ZONE_COLOUR = {
  interval: ['#fef2f2', '#b91c1c'],
  threshold: ['#fffbeb', '#b45309'],
  steady: ['#f0f9ff', '#0369a1'],
  easy: ['#ecfdf5', '#047857'],
  recovery: ['#f1f5f9', '#475569'],
};

const layout = ({ slug, title, description, crumbs, body, extraSchema }) => {
  const REL = relFor(slug);
  const url = `${SITE_ORIGIN}/${slug}/`;
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_ORIGIN}${c.href}`,
    })),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#2563eb">
<title>${esc(title)} | Race Pace Pro</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="${REL}favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="${REL}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${REL}apple-touch-icon.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Race Pace Pro">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE_ORIGIN}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE_ORIGIN}/og-image.png">
<script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>
${extraSchema ? `<script type="application/ld+json">${JSON.stringify(extraSchema)}</script>` : ''}
<style>${STYLES}</style>
${analyticsHtml()}
</head>
<body>
<div class="bar"><div class="in"><a href="${REL}">${LOGO}<b>Race Pace Pro</b></a></div></div>
<main>
<nav class="crumb">${crumbs
    .map((c, i) => (i === crumbs.length - 1 ? esc(c.name) : `<a href="${REL}${c.href.replace(/^\//, '')}">${esc(c.name)}</a>`))
    .join(' › ')}</nav>
${body}
</main>
<footer><div class="in">Race Pace Pro is a free running pace calculator. Calculations run entirely in your browser.</div></footer>
</body>
</html>
`;
};

const splitTable = (splits, unit) => `
<table><thead><tr><th>Distance</th><th class="r">Elapsed</th></tr></thead><tbody>
${splits
  .map(
    (s) =>
      `<tr${s.isFinish ? ' class="fin"' : ''}><td>${
        Number.isInteger(s.distance) ? s.distance : s.distance.toFixed(2).replace(/\.?0+$/, '')
      } ${unit}</td><td class="r">${formatClock(s.seconds)}</td></tr>`
  )
  .join('')}
</tbody></table>`;

const goalBody = (page, siblings, REL) => {
  const [bg, fg] = ZONE_COLOUR[page.zone.id];
  return `
<h1>${esc(page.heading)}</h1>
<p>To finish a ${esc(page.race.name.toLowerCase())} in under ${esc(page.label)}${
    page.totalSeconds < 3600 ? ' minutes' : ''
  }, you need to average <strong>${formatPace(page.perKm)} per kilometre</strong>,
or ${formatPace(page.perMile)} per mile, for the full ${page.race.km} km.</p>

<div class="hero">
  <div class="k">Required pace</div>
  <div class="v">${formatPace(page.perKm)}<span style="font-size:18px;color:#94a3b8"> /km</span></div>
  <div class="m">${formatPace(page.perMile)} per mile · finish ${formatClock(page.totalSeconds)}</div>
  <span class="pill" style="background:${bg};color:${fg}">${esc(page.zone.label)} effort</span>
</div>

<div class="card">
  <h2>Even-paced splits</h2>
  <p>Elapsed time you should see at each marker if you run the whole thing at one effort.</p>
  <div class="grid two">
    <div>${splitTable(page.splits.km, 'km')}</div>
    <div>${splitTable(page.splits.mi, 'mi')}</div>
  </div>
</div>

<div class="card">
  <h2>Pacing it in practice</h2>
  <p>These splits assume even effort on a flat course. Most personal bests are actually run
  slightly negative. That means a touch slower than target for the first half, then faster once you know
  the effort is sustainable. Going out fast and hanging on is the most common way to miss a
  time goal.</p>
  <p>Open this target in the calculator to adjust it, switch units, or model a negative split.</p>
  <p><a class="cta" href="${REL}${esc(page.calculatorQuery)}">Open in the calculator</a></p>
</div>

<div class="card">
  <h2>Other ${esc(page.race.name)} targets</h2>
  <div class="links">
    ${siblings
      .map((s) => `<a href="${REL}${s.slug}/">Sub-${esc(s.label)}</a>`)
      .join('')}
  </div>
  <p style="margin-top:14px"><a href="${REL}pace/${page.race.id}/">All ${esc(
    page.race.name
  )} paces →</a></p>
</div>`;
};

const hubBody = (page, REL) => `
<h1>${esc(page.heading)}</h1>
<p>The pace required for every common ${esc(
  page.race.name.toLowerCase()
)} goal time, over ${page.race.km} km (${(page.race.km / 1.609344).toFixed(2)} miles).
Pick a target for its full split table.</p>

<div class="card">
  <table>
    <thead><tr><th>Goal time</th><th class="r">Per km</th><th class="r">Per mile</th><th class="r"></th></tr></thead>
    <tbody>
      ${page.goals
        .map(
          (g) => `<tr>
        <td><a href="${REL}${g.slug}/">Sub-${esc(g.label)}</a></td>
        <td class="r">${formatPace(g.perKm)}</td>
        <td class="r">${formatPace(g.perMile)}</td>
        <td class="r"><a href="${REL}${g.slug}/">Splits →</a></td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>
</div>

<div class="card">
  <h2>Work out your own target</h2>
  <p>Any distance, any pace, in kilometres or miles, with split times and negative-split pacing.</p>
  <p><a class="cta" href="${REL}${esc(page.calculatorQuery)}">Open the calculator</a></p>
</div>

<div class="card">
  <h2>Guides</h2>
  <div class="links">
    ${ARTICLES.map((a) => `<a href="${REL}${a.slug}/">${esc(a.title)}</a>`).join('')}
  </div>
</div>

<div class="card">
  <h2>Other distances</h2>
  <div class="links">
    ${RACES.filter((r) => r.id !== page.race.id)
      .map((r) => `<a href="${REL}pace/${r.id}/">${esc(r.name)}</a>`)
      .join('')}
  </div>
</div>

<div class="card">
  <h2>Not sure which goal is realistic?</h2>
  <p>Predict your ${esc(page.race.name.toLowerCase())} time from a race you have already run.</p>
  <p><a class="cta" href="${REL}predictor/">Open the race time predictor</a></p>
</div>`;

const articleBody = (article, REL) => `
<h1>${esc(article.heading)}</h1>
<p class="lede">${esc(article.intro)}</p>
${article.sections
  .map(
    (section) => `<div class="card"><h2>${esc(section.heading)}</h2>${section.blocks
      .map((block) =>
        typeof block === 'string'
          ? `<p>${esc(block)}</p>`
          : `<ul>${block.list.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`
      )
      .join('')}</div>`
  )
  .join('')}
<div class="card">
  <h2>Put a number on it</h2>
  <p>Work out the pace any target demands, with split times you can carry into the race.</p>
  <p><a class="cta" href="${REL}">Open the calculator</a></p>
  <div class="links" style="margin-top:14px">
    ${RACES.map((r) => `<a href="${REL}pace/${r.id}/">${esc(r.name)} paces</a>`).join('')}
  </div>
</div>`;

const MARATHON_KM = 42.195;
const REFERENCE_GOALS = [10800, 12600, 14400, 16200];

const marathonBody = (race, REL) => `
<h1>Pacing the ${esc(race.name)}</h1>
<p class="lede">${esc(race.summary)}</p>

<div class="card">
  <table>
    <tbody>
      <tr><td><strong>Where</strong></td><td class="r">${esc(race.city)}, ${esc(race.country)}</td></tr>
      <tr><td><strong>Usually held</strong></td><td class="r">${esc(race.month)}</td></tr>
      <tr><td><strong>Course</strong></td><td class="r">${esc(race.profile)}</td></tr>
      <tr><td><strong>Official site</strong></td><td class="r"><a href="${esc(
        race.officialUrl
      )}" rel="noopener nofollow" target="_blank">Dates and entry</a></td></tr>
    </tbody>
  </table>
  <p style="margin-top:12px;font-size:13px;color:#64748b">Dates, ballots and entry rules change
  every year and are not listed here. Check the official site.</p>
</div>

<div class="card">
  <h2>How to pace it</h2>
  ${race.pacing.map((para) => `<p>${esc(para)}</p>`).join('')}
</div>

<div class="card">
  <h2>Worth knowing</h2>
  <ul>${race.watchFor.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
</div>

<div class="card">
  <h2>What the common targets ask for</h2>
  <table>
    <thead><tr><th>Finish</th><th class="r">Per km</th><th class="r">Per mile</th></tr></thead>
    <tbody>
      ${REFERENCE_GOALS.map((seconds) => {
        const perKm = seconds / MARATHON_KM;
        const perMile = seconds / (MARATHON_KM / 1.609344);
        return `<tr><td>${formatClock(seconds)}</td><td class="r">${formatPace(
          perKm
        )}</td><td class="r">${formatPace(perMile)}</td></tr>`;
      }).join('')}
    </tbody>
  </table>
  <p style="margin-top:12px"><a href="${REL}pace/marathon/">Every marathon target and its full split table</a></p>
  <p><a class="cta" href="${REL}?d=marathon&u=km&m=time&t=12600">Open the calculator</a></p>
</div>

<div class="card">
  <h2>Other marathons</h2>
  <div class="links">
    ${MARATHONS.filter((other) => other.id !== race.id)
      .map((other) => `<a href="${REL}marathons/${other.id}/">${esc(other.name)}</a>`)
      .join('')}
  </div>
</div>`;

const predictorBody = (REL) => `
<h1>Race time predictor</h1>
<p class="lede">What a result at one distance suggests you can run at another. Every figure below
comes from the Riegel formula, the same calculation the interactive predictor uses.</p>

<div class="card">
  <h2>How the prediction works</h2>
  <p>Riegel's formula scales a known result by the ratio of the two distances, raised to a power:</p>
  <p><strong>predicted time = known time x (new distance / known distance) ^ 1.06</strong></p>
  <p>The exponent is the whole idea. At 1.0 you would hold the same pace forever, which nobody
  does. At 1.06 the formula models the slowing down that comes with distance. Some coaches use
  1.07 or 1.08 for the marathon specifically, which is more conservative and often more accurate
  for anyone who has not built marathon specific endurance.</p>
  <p>The tables below use 1.06. Treat them as an upper bound on what your current fitness allows,
  not a target to train toward.</p>
</div>

${predictorTables()
  .map(
    (table) => `<div class="card">
  <h2>If you have run a ${esc(table.source)}</h2>
  <table>
    <thead><tr><th>${esc(table.source)} time</th>${table.targets
      .map((t) => `<th class="r">${esc(t)}</th>`)
      .join('')}</tr></thead>
    <tbody>
      ${table.rows
        .map(
          (row) => `<tr>
        <td>${formatClock(row.seconds)}</td>
        ${row.predictions.map((p) => `<td class="r">${formatClock(Math.round(p))}</td>`).join('')}
      </tr>`
        )
        .join('')}
    </tbody>
  </table>
</div>`
  )
  .join('')}

<div class="card">
  <h2>Where predictions go wrong</h2>
  <p>Riegel assumes you are equally well trained for both distances. Almost nobody is. The formula
  is at its most reliable between neighbouring distances, and at its least reliable predicting a
  marathon from a 5K, where it quietly assumes an endurance base that a fast 5K says nothing
  about.</p>
  <p>It also assumes even effort on a flat course in good conditions. Heat, hills and a congested
  start all cost time no formula accounts for.</p>
  <p><a class="cta" href="${REL}guides/marathon-goal-time/">Read the full guide to setting a goal time</a></p>
</div>

<div class="card">
  <h2>Turn a prediction into a pacing plan</h2>
  <p>Once you have a target, the calculator gives you the pace it needs and the split times to run
  it.</p>
  <p><a class="cta" href="${REL}">Open the calculator</a></p>
</div>`;

const marathonIndexBody = (REL) => `
<h1>Marathon pacing guides</h1>
<p class="lede">What each course does to your splits, and how to plan for it. Dates and entry are
left to the official sites, which are linked from every page.</p>

<div class="card">
  <table>
    <thead><tr><th>Race</th><th>Month</th><th>Course</th></tr></thead>
    <tbody>
      ${MARATHONS.map(
        (race) => `<tr>
        <td><a href="${REL}marathons/${race.id}/">${esc(race.name)}</a></td>
        <td>${esc(race.month)}</td>
        <td>${esc(race.profile)}</td>
      </tr>`
      ).join('')}
    </tbody>
  </table>
</div>

<div class="card">
  <h2>Work out your own target</h2>
  <p>Any distance, any pace, with split times and negative split pacing.</p>
  <p><a class="cta" href="${REL}">Open the calculator</a></p>
</div>`;

// The home page is the React app, so everything React draws is invisible to a
// crawler that does not run JavaScript. These sections are written into the
// built index.html as plain HTML instead. Links are relative with no leading
// slash so they resolve from a domain root and from a subpath alike.
const CARD = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6';
const H2 = 'text-base font-semibold text-slate-900';
const PARA = 'mt-2 text-sm leading-relaxed text-slate-600';

const homeStaticHtml = () => `
<div class="mt-4 space-y-4">
  <section class="${CARD}">
    <h2 class="${H2}">About this calculator</h2>
    ${ABOUT.map((para) => `<p class="${PARA}">${esc(para)}</p>`).join('')}
  </section>

  <section class="${CARD}">
    <h2 class="${H2}">Pacing specific marathons</h2>
    <p class="${PARA}">What each course does to your splits. Berlin and Valencia let you hold one
    pace, Boston punishes you for it, and New York asks for uneven splits by design.</p>
    <div class="mt-3 flex flex-wrap gap-2">
      ${MARATHONS.map(
        (race) =>
          `<a href="marathons/${race.id}/" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">${esc(
            race.name
          )}</a>`
      ).join('')}
    </div>
    <p class="mt-3 text-sm"><a href="marathons/" class="font-medium text-blue-700 hover:underline">All marathon pacing guides</a></p>
  </section>

  <section class="${CARD}">
    <h2 class="${H2}">Guides</h2>
    <ul class="mt-3 divide-y divide-slate-100">
      ${ARTICLES.map(
        (article) => `<li class="py-3 first:pt-0 last:pb-0">
        <a href="${article.slug}/" class="text-sm font-medium text-blue-700 hover:underline">${esc(
          article.title
        )}</a>
        <p class="mt-1 text-sm leading-relaxed text-slate-600">${esc(article.description)}</p>
      </li>`
      ).join('')}
    </ul>
  </section>

  <section class="${CARD}">
    <h2 class="${H2}">Race time predictor</h2>
    <p class="${PARA}">What a result at one distance suggests you can run at another, for every
    common finishing time. Riegel formula tables for 5K, 10K, half marathon and marathon.</p>
    <p class="mt-3 text-sm"><a href="predictor/" class="font-medium text-blue-700 hover:underline">Open the race time predictor</a></p>
  </section>

  <section class="${CARD}">
    <h2 class="${H2}">Race pace charts</h2>
    <p class="${PARA}">Every common goal time for each distance, with the pace it demands and a
    full split table.</p>
    <div class="mt-3 flex flex-wrap gap-2">
      ${RACES.map(
        (race) =>
          `<a href="pace/${race.id}/" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">${esc(
            race.name
          )}</a>`
      ).join('')}
    </div>
  </section>

  <section class="${CARD}">
    <h2 class="${H2}">Frequently asked questions</h2>
    <dl class="mt-3 divide-y divide-slate-100">
      ${FAQ.map(
        (item) => `<div class="py-3 first:pt-0 last:pb-0">
        <dt class="text-sm font-medium text-slate-900">${esc(item.question)}</dt>
        <dd class="mt-1 text-sm leading-relaxed text-slate-600">${esc(item.answer)}</dd>
      </div>`
      ).join('')}
    </dl>
  </section>
</div>`;

// Derived from the same array the page renders, so the schema cannot describe
// questions the page does not show.
const faqSchemaHtml = () =>
  `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  })}</script>`;

const injectHomeContent = () => {
  const file = path.join(BUILD, 'index.html');
  let html = fs.readFileSync(file, 'utf8');

  // Anchored to real markup rather than HTML comments: the production build
  // minifies index.html and strips comments, so comment markers never survive.
  const ROOT_DIV = '<div id="root"></div>';
  const HEAD_END = '</head>';

  // Fail loudly. Silently dropping this would leave the most important page on
  // the site serving a crawler nothing but an empty div.
  [ROOT_DIV, HEAD_END].forEach((anchor) => {
    if (!html.includes(anchor)) {
      console.error(`generate-pages: anchor ${anchor} missing from build/index.html`);
      process.exit(1);
    }
  });

  html = html.replace(ROOT_DIV, ROOT_DIV + homeStaticHtml());
  html = html.replace(HEAD_END, faqSchemaHtml() + analyticsHtml() + HEAD_END);
  fs.writeFileSync(file, html);
};

// Counted here rather than recomputed at the end. The old total was hand
// written arithmetic over the page sources, so it silently went stale every
// time a page was added from somewhere new.
let written = 0;

const write = (slug, html) => {
  const dir = path.join(BUILD, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  written += 1;
};

const main = () => {
  if (!fs.existsSync(BUILD)) {
    console.error('generate-pages: build/ not found. Run the CRA build first.');
    process.exit(1);
  }

  const pages = allPages();
  const goalsByRace = Object.fromEntries(RACES.map((r) => [r.id, hubPage(r).goals]));

  pages.forEach((page) => {
    const crumbs = [
      { name: 'Home', href: '/' },
      { name: page.race.name, href: `/pace/${page.race.id}/` },
    ];
    if (page.type === 'goal') crumbs.push({ name: `Sub-${page.label}`, href: `/${page.slug}/` });

    const body =
      page.type === 'goal'
        ? goalBody(
            page,
            goalsByRace[page.race.id].filter((g) => g.totalSeconds !== page.totalSeconds),
            relFor(page.slug)
          )
        : hubBody(page, relFor(page.slug));

    write(page.slug, layout({ ...page, crumbs, body }));
  });

  ARTICLES.forEach((article) => {
    write(
      article.slug,
      layout({
        ...article,
        crumbs: [
          { name: 'Home', href: '/' },
          { name: article.title, href: `/${article.slug}/` },
        ],
        body: articleBody(article, relFor(article.slug)),
        extraSchema: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: article.title,
          description: article.description,
          mainEntityOfPage: `${SITE_ORIGIN}/${article.slug}/`,
          author: { '@type': 'Organization', name: 'Race Pace Pro' },
          publisher: { '@type': 'Organization', name: 'Race Pace Pro' },
        },
      })
    );
  });

  write(
    PREDICTOR_PAGE.slug,
    layout({
      slug: PREDICTOR_PAGE.slug,
      title: PREDICTOR_PAGE.title,
      description: PREDICTOR_PAGE.description,
      crumbs: [{ name: 'Home', href: '/' }, { name: 'Race time predictor', href: '/predictor/' }],
      body: predictorBody(relFor(PREDICTOR_PAGE.slug)),
    })
  );

  write(
    'marathons',
    layout({
      slug: 'marathons',
      title: 'Marathon Pacing Guides by Race',
      description:
        'Pacing guides for major marathons, covering what each course does to your splits and how to plan for it.',
      crumbs: [{ name: 'Home', href: '/' }, { name: 'Marathons', href: '/marathons/' }],
      body: marathonIndexBody(relFor('marathons')),
    })
  );

  MARATHONS.forEach((race) => {
    write(
      `marathons/${race.id}`,
      layout({
        slug: `marathons/${race.id}`,
        title: `${race.name} Pacing Guide`,
        description: `How to pace the ${race.name}: ${race.profile.toLowerCase()} course in ${
          race.city
        }, what to expect on the day, and the splits for common goal times.`,
        crumbs: [
          { name: 'Home', href: '/' },
          { name: 'Marathons', href: '/marathons/' },
          { name: race.name, href: `/marathons/${race.id}/` },
        ],
        body: marathonBody(race, relFor(`marathons/${race.id}`)),
      })
    );
  });

  injectHomeContent();

  const urls = [
    '',
    ...pages.map((p) => `${p.slug}/`),
    ...ARTICLES.map((a) => `${a.slug}/`),
    `${PREDICTOR_PAGE.slug}/`,
    'marathons/',
    ...MARATHONS.map((race) => `marathons/${race.id}/`),
  ];
  fs.writeFileSync(
    path.join(BUILD, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${SITE_ORIGIN}/${u}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${
        u === '' ? '1.0' : '0.7'
      }</priority>\n  </url>`
  )
  .join('\n')}
</urlset>
`
  );

  console.log(`generate-pages: wrote ${written} pages and a sitemap with ${urls.length} URLs`);
};

main();

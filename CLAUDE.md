# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` runs the dev server (CRA, http://localhost:3000)
- `npm run build` produces a production build in `build/`, then `postbuild` runs `scripts/generate-pages.js` to write the static SEO pages. Both Vercel and the Actions workflow use `npm run build`, so the pages are generated on every deploy.
- `npm test` runs tests via `react-scripts test` (Jest + Testing Library, watch mode). No test files exist yet; to run a single test file use `npm test -- <path-or-name-pattern>`.
- `npm run deploy` builds and publishes `build/` to the `gh-pages` branch (via `gh-pages` package)

There is no lint script; ESLint runs as part of `react-scripts` (config lives in `package.json`'s `eslintConfig`, which disables `react-hooks/exhaustive-deps`).

## Architecture

This is a Create React App (react-scripts 5) single-page app with Tailwind CSS, containing effectively one feature:

- `src/index.js` mounts `App`.
- `src/App.js` renders `PaceCalculator`, which is the whole app.
- `src/PaceCalculator.js` is the entire application logic and UI: a single functional component holding all state (distance, unit, pace, time, active tab) and both calculation directions (pace→time and time→pace). There is no routing, no additional components, and no backend. All conversion math (km/mile factors, popular race distances) is inlined in this file.
- State flows through one `useEffect` that recalculates the derived value (time or pace, based on `activeTab`) whenever any relevant input changes, rather than each handler recalculating directly.

### Static SEO pages

Alongside the React app, the build emits ~60 standalone HTML pages: one per race distance ("hub") and one per goal time ("Sub-3:30 Marathon") under `build/pace/`, plus guides, marathon pacing pages and the race time predictor. They exist because the app is client-rendered: a crawler hitting a React route sees an empty `<div id="root">`, so these are written as plain HTML instead.

- `src/pageData.js` defines the page set and derives every figure from `paceMath`, so pages cannot drift from the calculator. It lives in `src/` so the normal test runner covers it.
- `scripts/generate-pages.js` renders them. It loads `src/pageData.js` through `@babel/core` at build time rather than duplicating the maths in CommonJS.
- Generated pages are static content and link into the app via the query-string state in `src/urlState.js` (`/?d=marathon&m=time&t=12600`), so the calculator opens on the right target.
- All internal links are relative, not absolute, because absolute paths break wherever the site is served from a subpath. The prefix is computed per page by `relFor(slug)`, since depth varies: `pace/<slug>/` and `guides/<slug>/` are two levels down, `marathons/` is one.
- `src/marathons.js` holds one entry per race (22 of them), rendered at `marathons/<id>/` with an index at `marathons/`. The home page links `FEATURED_MARATHONS` rather than all of them, and each race page links `relatedRaces()` rather than all the others: at 22 races, linking everything everywhere is a wall of near identical anchors that spreads each page's link weight thinly. These are pacing and course guides. **They deliberately carry no dates, ballot windows or entry deadlines**, because this project cannot verify them and a wrong deadline published as fact is the worst failure the site could have. `month` is stated because these races sit in the same month every year; a specific date is not. Tests in `src/marathons.test.js` fail the build if a year or calendar date appears in the prose.
- `src/raceTheme.js` gives each marathon its own colour and abstract motif, generated from its index rather than picked by hand, so adding a race never means choosing a colour. Two things it solves rather than guesses: lightness is walked down per hue until white text clears a 5:1 contrast ratio (a fixed lightness passes for blue and fails badly for yellow), and the yellow to yellow-green band is skipped entirely because those hues go khaki once dark enough to carry text. Motifs are arcs, dots and diagonals only, never a line a reader could mistake for a course elevation profile, since this project has no verified elevation data.
- `scripts/generate-og-images.js` renders one 1200x630 share image per race into `public/og/marathons/`. It is **not** part of `npm run build`: it needs Playwright and a headless browser, which do not belong in the deploy path for images that change only when a race is added. Run it manually after adding a race. The output is committed, and tests in `src/raceTheme.test.js` fail if a race has no image, if one is empty or oversized, or if an orphan is left behind by a rename.
- `src/hubContent.js` carries the distance specific prose for the four pace chart hubs, which were the thinnest pages on the site at around 165 words. Anything quotable is derived: `stepUpPenalty` computes how much slower a longer race is per kilometre straight from the Riegel exponent, so the hub prose cannot drift away from the predictor. Each hub also emits `FAQPage` structured data from the same array it renders.
- `src/predictorData.js` and `src/RacePredictor.js` are the two faces of the race time predictor. Both derive from `predictTime` in `paceMath`, so the interactive tool, the static tables at `predictor/`, and the Riegel explanation in `guides/marathon-goal-time` cannot disagree. A test pins the published table to the exact figure the guide quotes in prose.
- `src/analytics.js` holds the analytics tags, and the generator injects them into every page. It is deliberately not a React component: the generated pages load **no JavaScript bundle at all**, so a component would track the home page and nothing else. GA4 is wired but off behind `GA4_MEASUREMENT_ID`; switching it on means adding a cookie consent prompt, and a test fails to make that decision explicit.
- `src/formControls.js` holds the shared `TimeSelect`, `Field` and select styling used by the calculator, the training planner and the predictor.
- `src/siteFooter.js` is the single source for the footer, including the trademark disclaimer that appears on all 63 pages. The marathon pages name races that are protected marks; naming a race in order to write about pacing it is referential use, and the disclaimer, the absence of any race logo or trade dress, and the `rel="nofollow"` on every official link are what keep that posture clear. `src/siteFooter.test.js` asserts the hand written copy in `public/index.html` matches. Not legal advice, and not a substitute for a trademark search on the site's own name.
- `src/navigation.js` is the single source for the site nav. It renders into every generated page from `layout()`, and `public/index.html` carries a hand written copy because the home page is the React shell rather than a generated file. `src/navigation.test.js` asserts the two agree and that every destination is a page the build actually writes, so neither copy can drift or point at a 404.
- `pace/` and `guides/` are index pages, added because the nav needed destinations. Every generated page is 42rem wide, matching Tailwind's `max-w-2xl` in the React shell; they were 44rem and 42rem, which shifted the header by 32px when a reader moved between the home page and a generated one.
- `sitemap.xml` is written by the generator and is no longer a file in `public/`. The page count in the build log comes from a counter in `write()`, not from arithmetic over the page sources, which used to go stale whenever a page was added from somewhere new.

## Deployment

Two targets fire on a push to `main`:

- `.github/workflows/deploy.yml` builds and pushes to the `gh-pages` branch via `JamesIves/github-pages-deploy-action`, served at `https://kiralyor.github.io/racepacepro`, a **subpath**.
- Vercel is connected to the repo and promotes a production deploy, served at a domain **root**.

`homepage` in `package.json` is `"."` so CRA emits relative asset paths, which resolve under both. Do not set it back to an absolute URL: that hardcodes a `/racepacepro/` prefix onto every script and stylesheet, which resolves on GitHub Pages but 404s on Vercel and renders a blank page. The app has no client-side routing, so relative paths carry no downside here.

`racepacepro.com` is registered at GoDaddy and points at Vercel. DNS records, Search Console setup, and the pending manual account steps live in `docs/operations.md`.

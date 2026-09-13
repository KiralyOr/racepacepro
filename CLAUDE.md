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

Alongside the React app, the build emits ~34 standalone HTML pages under `build/pace/`, one per race distance ("hub") and one per goal time ("Sub-3:30 Marathon"). They exist because the app is client-rendered: a crawler hitting a React route sees an empty `<div id="root">`, so these are written as plain HTML instead.

- `src/pageData.js` defines the page set and derives every figure from `paceMath`, so pages cannot drift from the calculator. It lives in `src/` so the normal test runner covers it.
- `scripts/generate-pages.js` renders them. It loads `src/pageData.js` through `@babel/core` at build time rather than duplicating the maths in CommonJS.
- Generated pages are static content and link into the app via the query-string state in `src/urlState.js` (`/?d=marathon&m=time&t=12600`), so the calculator opens on the right target.
- All internal links use a constant `../../` prefix, not absolute paths: every generated page sits two levels deep, and absolute paths break wherever the site is served from a subpath.
- `sitemap.xml` is written by the generator and is no longer a file in `public/`.

## Deployment

Two targets fire on a push to `main`:

- `.github/workflows/deploy.yml` builds and pushes to the `gh-pages` branch via `JamesIves/github-pages-deploy-action`, served at `https://kiralyor.github.io/racepacepro`, a **subpath**.
- Vercel is connected to the repo and promotes a production deploy, served at a domain **root**.

`homepage` in `package.json` is `"."` so CRA emits relative asset paths, which resolve under both. Do not set it back to an absolute URL: that hardcodes a `/racepacepro/` prefix onto every script and stylesheet, which resolves on GitHub Pages but 404s on Vercel and renders a blank page. The app has no client-side routing, so relative paths carry no downside here.

`racepacepro.com` is registered at GoDaddy and points at Vercel. DNS records, Search Console setup, and the pending manual account steps live in `docs/operations.md`.

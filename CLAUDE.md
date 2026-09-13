# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the dev server (CRA, http://localhost:3000)
- `npm run build` — production build to `build/`
- `npm test` — run tests via `react-scripts test` (Jest + Testing Library, watch mode). No test files exist yet; to run a single test file use `npm test -- <path-or-name-pattern>`.
- `npm run deploy` — build and publish `build/` to the `gh-pages` branch (via `gh-pages` package)

There is no lint script; ESLint runs as part of `react-scripts` (config lives in `package.json`'s `eslintConfig`, which disables `react-hooks/exhaustive-deps`).

## Architecture

This is a Create React App (react-scripts 5) single-page app with Tailwind CSS, containing effectively one feature:

- `src/index.js` mounts `App`.
- `src/App.js` renders `PaceCalculator` — the whole app.
- `src/PaceCalculator.js` is the entire application logic and UI: a single functional component holding all state (distance, unit, pace, time, active tab) and both calculation directions (pace→time and time→pace). There is no routing, no additional components, and no backend — all conversion math (km/mile factors, popular race distances) is inlined in this file.
- State flows through one `useEffect` that recalculates the derived value (time or pace, based on `activeTab`) whenever any relevant input changes, rather than each handler recalculating directly.

## Deployment

Two targets fire on a push to `main`:

- `.github/workflows/deploy.yml` builds and pushes to the `gh-pages` branch via `JamesIves/github-pages-deploy-action`, served at `https://kiralyor.github.io/racepacepro` — a **subpath**.
- Vercel is connected to the repo and promotes a production deploy, served at a domain **root**.

`homepage` in `package.json` is `"."` so CRA emits relative asset paths, which resolve under both. Do not set it back to an absolute URL: that hardcodes a `/racepacepro/` prefix onto every script and stylesheet, which resolves on GitHub Pages but 404s on Vercel and renders a blank page. The app has no client-side routing, so relative paths carry no downside here.

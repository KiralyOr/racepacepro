// Analytics tags, injected into every page by scripts/generate-pages.js.
//
// This lives here rather than in a React component for a reason worth
// remembering: the 45 generated pages load no JavaScript bundle at all. They
// are plain HTML with inline CSS. A React based analytics install would have
// tracked the home page and nothing else, which is the opposite of what this
// site needs, since the generated pages are the ones built to attract search
// traffic.

// Vercel Web Analytics. Cookieless, so it needs no consent banner.
//
// The path is root-absolute because that is where the platform serves it, and
// it is the one deliberate exception to the relative link rule in CLAUDE.md:
// it is a platform endpoint, not an internal link. On the GitHub Pages copy it
// simply 404s and reports nothing, which is the behaviour we want. Only the
// canonical domain should count.
const VERCEL_TAG = '<script defer src="/_vercel/insights/script.js"></script>';

// Set to a measurement id such as 'G-XXXXXXXXXX' to add Google Analytics.
//
// Before doing so, note that GA4 sets cookies, so EU visitors need a consent
// prompt, and a large share of this site's audience is European: the marathon
// pages target Berlin, Valencia, Prague, London and Paris. Search Console
// already covers queries, impressions, clicks and position per page, so GA4's
// genuine addition is on-page behaviour depth. That is worth little at low
// traffic and a lot at high traffic. Revisit when there is traffic to segment.
export const GA4_MEASUREMENT_ID = null;

const ga4Tags = (id) => [
  `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`,
  `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}` +
    `gtag('js',new Date());gtag('config','${id}')</script>`,
];

export const analyticsTags = () => [
  VERCEL_TAG,
  ...(GA4_MEASUREMENT_ID ? ga4Tags(GA4_MEASUREMENT_ID) : []),
];

export const analyticsHtml = () => analyticsTags().join('');

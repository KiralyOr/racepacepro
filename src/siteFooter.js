// Footer text, in one place.
//
// Like the navigation, it appears twice: the generator renders it into every
// generated page, and public/index.html carries a copy because the home page
// is the React shell. src/siteFooter.test.js asserts the two agree.
//
// The second line is a trademark disclaimer. The marathon pages name races
// that are protected marks, which is legitimate: naming a race in order to
// write about pacing it is referential use, and there is no other way to
// identify the Boston Marathon than by calling it that. What strengthens that
// position is being unambiguous about the absence of any relationship, which
// this states, no race logos or trade dress appear anywhere on the site, and
// every race page links out to the official site with rel="nofollow".
//
// Not legal advice, and not a substitute for a trademark search on the site's
// own name before investing further in the brand.

export const FOOTER_LINES = [
  'Race Pace Pro is a free running pace calculator. Calculations run entirely in your browser.',
  'Independent, and not affiliated with, endorsed by or sponsored by any race listed. Race names and trademarks are the property of their respective organisers.',
];

// The site navigation, in one place.
//
// It appears twice: scripts/generate-pages.js renders it into every generated
// page, and public/index.html carries a copy for the home page, which is the
// React shell rather than a generated file. src/navigation.test.js asserts the
// two agree and that every destination is a page the build actually writes, so
// neither copy can drift or point at a 404.
//
// Hrefs are relative with no leading slash. Generated pages prepend their own
// depth prefix; the home page uses them as they are.

export const NAV = [
  { href: '', label: 'Calculator' },
  { href: 'pace/', label: 'Pace charts' },
  { href: 'predictor/', label: 'Predictor' },
  { href: 'marathons/', label: 'Marathons' },
  { href: 'guides/', label: 'Guides' },
];

// Which nav entry a given page sits under, for marking the current section.
export const sectionFor = (slug) => {
  if (!slug) return '';
  const top = `${slug.split('/')[0]}/`;
  return NAV.some((item) => item.href === top) ? top : '';
};

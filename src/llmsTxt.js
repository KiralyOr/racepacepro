// llms.txt, generated rather than hand written.
//
// The convention is a proposal rather than a standard, and no crawler is
// documented as requiring it, so this is cheap insurance rather than a fix for
// anything. What makes it worth having at all is that it costs nothing to keep
// correct: every entry is derived from the same data the pages are built from,
// so a hand written file going stale the first time a race is added is not a
// failure mode here.
//
// URLs are absolute, which is the opposite of the rule for internal links in
// the HTML. That is deliberate: this file is read by agents fetching it from
// somewhere else entirely, and a relative path is meaningless to them. It also
// means the GitHub Pages copy points at the canonical domain, which is right.

import { RACES, SITE_ORIGIN, allPages, hubPage } from './pageData';
import { ARTICLES } from './articles';
import { MARATHONS } from './marathons';
import { PREDICTOR_PAGE } from './predictorData';

const url = (slug) => `${SITE_ORIGIN}/${slug ? `${slug}/` : ''}`;
const entry = (title, slug, note) => `- [${title}](${url(slug)}): ${note}`;

const SUMMARY =
  'Free running pace calculator for 5K, 10K, half marathon and marathon. Work out a finish ' +
  'time from a target pace, or the pace a goal time demands, with full split tables and ' +
  'negative split pacing.';

// Stated up front because both facts change how the site should be cited, and
// an agent summarising a marathon page has no other way to learn either.
const CAVEATS = [
  'The marathon pages carry no dates, ballot windows or entry deadlines. Those change every ' +
    'year and this project does not verify them, so each page links to the official race site ' +
    'for anything time sensitive. The month a race is held is stated, because that is stable.',
  'Race Pace Pro is independent and is not affiliated with, endorsed by or sponsored by any ' +
    'race it names.',
  'Every figure on the site is computed from one shared maths module, so the calculator, the ' +
    'static pace charts and the race time predictor cannot disagree with each other.',
];

export const buildLlmsTxt = () => {
  const pages = allPages();
  const goals = pages.filter((page) => page.type === 'goal');

  const sections = [
    ['Tools', [
      entry('Running pace calculator', '', SUMMARY),
      entry('Race time predictor', PREDICTOR_PAGE.slug, PREDICTOR_PAGE.description),
    ]],

    ['Pace charts', [
      entry(
        'All pace charts',
        'pace',
        'Index of the four distance charts, each listing every common goal time with the pace it ' +
          'demands per kilometre and per mile.'
      ),
      ...RACES.map((race) => {
        const hub = hubPage(race);
        return entry(hub.title.split(':')[0], hub.slug, hub.description);
      }),
    ]],

    ['Marathon pacing guides', [
      entry(
        'All marathon pacing guides',
        'marathons',
        `Index of ${MARATHONS.length} races, each covering what that specific course does to your ` +
          'splits and how to plan for it.'
      ),
      ...MARATHONS.map((race) =>
        entry(
          race.name,
          `marathons/${race.id}`,
          `${race.profile}. ${race.city}, ${race.country}, held in ${race.month}. ${race.summary}`
        )
      ),
    ]],

    ['Guides', [
      entry(
        'All guides',
        'guides',
        'Index of the long form guides on marathon training and setting a realistic goal time.'
      ),
      ...ARTICLES.map((article) => entry(article.title, article.slug, article.description)),
    ]],

    // The convention reserves this heading for detail a reader can skip when
    // context is short. Thirty goal time pages is exactly that: useful if
    // someone wants a specific target, noise otherwise.
    ['Optional', goals.map((page) => entry(page.title.split(':')[0], page.slug, page.description))],
  ];

  return [
    '# Race Pace Pro',
    '',
    `> ${SUMMARY}`,
    '',
    ...CAVEATS.flatMap((line) => [line, '']),
    ...sections.flatMap(([heading, lines]) => [`## ${heading}`, '', ...lines, '']),
  ]
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()
    .concat('\n');
};

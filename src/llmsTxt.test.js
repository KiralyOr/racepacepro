import { buildLlmsTxt } from './llmsTxt';
import { RACES, SITE_ORIGIN, allPages } from './pageData';
import { ARTICLES } from './articles';
import { MARATHONS } from './marathons';
import { PREDICTOR_PAGE } from './predictorData';

const text = buildLlmsTxt();
const links = [...text.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]);

describe('llms.txt', () => {
  test('opens with the name and a blockquote summary, as the convention expects', () => {
    const lines = text.split('\n');
    expect(lines[0]).toBe('# Race Pace Pro');
    expect(lines[2].startsWith('> ')).toBe(true);
  });

  test('every page the site publishes is listed', () => {
    const expected = [
      `${SITE_ORIGIN}/`,
      `${SITE_ORIGIN}/pace/`,
      `${SITE_ORIGIN}/marathons/`,
      `${SITE_ORIGIN}/guides/`,
      `${SITE_ORIGIN}/${PREDICTOR_PAGE.slug}/`,
      ...allPages().map((p) => `${SITE_ORIGIN}/${p.slug}/`),
      ...ARTICLES.map((a) => `${SITE_ORIGIN}/${a.slug}/`),
      ...MARATHONS.map((r) => `${SITE_ORIGIN}/marathons/${r.id}/`),
    ];
    expected.forEach((u) => expect(links).toContain(u));
  });

  test('links are absolute, because a relative path means nothing to an agent elsewhere', () => {
    expect(links.length).toBeGreaterThan(0);
    links.forEach((u) => expect(u.startsWith(SITE_ORIGIN)).toBe(true));
  });

  test('no link is listed twice', () => {
    expect(new Set(links).size).toBe(links.length);
  });

  // The two facts an agent cannot infer from a page, and would otherwise get
  // wrong: that the absence of dates is deliberate, and that the site has no
  // relationship with the races it names.
  test('states the no-dates policy and the lack of affiliation', () => {
    expect(text).toMatch(/no dates, ballot windows or entry deadlines/);
    expect(text).toMatch(/not affiliated with, endorsed by or sponsored by/);
  });

  test('the thirty goal time pages sit under Optional, not the main sections', () => {
    const optional = text.slice(text.indexOf('## Optional'));
    const goals = allPages().filter((p) => p.type === 'goal');
    expect(goals.length).toBeGreaterThan(20);
    goals.forEach((p) => expect(optional).toContain(`${SITE_ORIGIN}/${p.slug}/`));
    // Hubs must stay above it, where a short-context reader still sees them.
    const main = text.slice(0, text.indexOf('## Optional'));
    RACES.forEach((r) => expect(main).toContain(`${SITE_ORIGIN}/pace/${r.id}/`));
  });

  test('every entry carries a description, not just a bare link', () => {
    text
      .split('\n')
      .filter((line) => line.startsWith('- ['))
      .forEach((line) => {
        const note = line.slice(line.indexOf('): ') + 3);
        expect(note.length).toBeGreaterThan(20);
      });
  });
});

// llms.txt and sitemap.xml describe the same site to two different audiences.
// If they disagree, one of them is lying about what exists.
describe('llms.txt against the page set', () => {
  test('lists exactly the URLs the sitemap does', () => {
    const sitemapUrls = [
      `${SITE_ORIGIN}/`,
      ...allPages().map((p) => `${SITE_ORIGIN}/${p.slug}/`),
      ...ARTICLES.map((a) => `${SITE_ORIGIN}/${a.slug}/`),
      `${SITE_ORIGIN}/pace/`,
      `${SITE_ORIGIN}/guides/`,
      `${SITE_ORIGIN}/${PREDICTOR_PAGE.slug}/`,
      `${SITE_ORIGIN}/marathons/`,
      ...MARATHONS.map((r) => `${SITE_ORIGIN}/marathons/${r.id}/`),
    ];
    expect([...links].sort()).toEqual([...sitemapUrls].sort());
  });
});

// The bug this suite missed the first time. Link text was derived by splitting
// the page title on a colon, which quietly truncated every goal time
// containing one: eighteen entries shipped reading "Sub-1", "Sub-2", "Sub-3",
// each pointing somewhere different. Descriptions were fine, links were
// unique, so nothing failed. Titles are what an agent reads first.
describe('link text', () => {
  const titles = [...text.matchAll(/^- \[([^\]]+)\]/gm)].map((m) => m[1]);

  test('every link has distinct text', () => {
    const seen = new Map();
    titles.forEach((t) => seen.set(t, (seen.get(t) || 0) + 1));
    expect([...seen].filter(([, n]) => n > 1)).toEqual([]);
  });

  test('there is one title per link', () => {
    expect(titles.length).toBe(links.length);
  });

  test('no goal time is truncated at its colon', () => {
    allPages()
      .filter((p) => p.type === 'goal')
      .forEach((page) => {
        const line = text.split('\n').find((l) => l.includes(`(${SITE_ORIGIN}/${page.slug}/)`));
        const title = line.slice(3, line.indexOf(']'));
        // "Sub-3:30 Marathon pace" must survive whole, not become "Sub-3".
        expect({ slug: page.slug, keepsLabel: title.includes(page.label) }).toEqual({
          slug: page.slug,
          keepsLabel: true,
        });
      });
  });
});

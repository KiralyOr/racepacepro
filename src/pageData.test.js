import { formatPace } from './paceMath';
import { GOAL_SECONDS, RACES, allPages, goalLabel, goalPage, goalSlug, hubPage } from './pageData';

describe('goal labels and slugs', () => {
  test('reads a sub-hour target in plain minutes', () => {
    expect(goalLabel(1200)).toBe('20');
    expect(goalSlug(1200)).toBe('sub-20');
  });

  test('switches to hours and minutes at an hour', () => {
    expect(goalLabel(12600)).toBe('3:30');
    expect(goalSlug(12600)).toBe('sub-3-30');
    expect(goalLabel(3600)).toBe('1:00');
  });
});

describe('the page set', () => {
  const pages = allPages();

  test('covers every hub and goal', () => {
    const goals = Object.values(GOAL_SECONDS).reduce((n, list) => n + list.length, 0);
    expect(pages).toHaveLength(RACES.length + goals);
  });

  test('slugs are unique and URL-safe', () => {
    const slugs = pages.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9/-]+$/));
  });

  // Duplicate titles or descriptions across pages are the classic way a
  // generated page set gets treated as thin or duplicated content.
  test('every page has its own title', () => {
    const titles = pages.map((p) => p.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  test('every page has its own description', () => {
    const descriptions = pages.map((p) => p.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  test('descriptions stay within a sensible length for a search result', () => {
    pages.forEach((page) => {
      expect(page.description.length).toBeGreaterThan(70);
      expect(page.description.length).toBeLessThan(200);
    });
  });
});

describe('goal page maths', () => {
  const marathon = RACES.find((r) => r.id === 'marathon');

  test('a sub-3:30 marathon needs 4:59 per km', () => {
    const page = goalPage(marathon, 12600);
    expect(formatPace(page.perKm)).toBe('4:59');
    expect(formatPace(page.perMile)).toBe('8:01');
  });

  test('splits finish on the goal time in both units', () => {
    const page = goalPage(marathon, 12600);
    ['km', 'mi'].forEach((unit) => {
      const splits = page.splits[unit];
      expect(splits[splits.length - 1].seconds).toBeCloseTo(12600, 6);
      expect(splits[splits.length - 1].isFinish).toBe(true);
    });
  });

  test('carries a training zone and a calculator link that restores the target', () => {
    const page = goalPage(marathon, 12600);
    expect(page.zone.id).toBe('steady');
    expect(page.calculatorQuery).toContain('d=marathon');
    expect(page.calculatorQuery).toContain('t=12600');
  });
});

describe('hubs link their goals', () => {
  test.each(RACES.map((r) => [r.name, r]))('%s', (_name, race) => {
    const hub = hubPage(race);
    expect(hub.goals).toHaveLength(GOAL_SECONDS[race.id].length);
    hub.goals.forEach((goal) => {
      expect(goal.slug.endsWith(race.id)).toBe(true);
      expect(goal.perKm).toBeGreaterThan(0);
    });
  });

  test('faster goals demand faster paces', () => {
    const hub = hubPage(RACES.find((r) => r.id === '10k'));
    const paces = hub.goals.map((g) => g.perKm);
    expect([...paces].sort((a, b) => a - b)).toEqual(paces);
  });
});

describe('guides', () => {
  const { ARTICLES } = require('./articles');

  test('every article has a unique slug under guides/', () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((slug) => expect(slug).toMatch(/^guides\/[a-z0-9-]+$/));
  });

  test('every article has real content, not a stub', () => {
    ARTICLES.forEach((article) => {
      expect(article.sections.length).toBeGreaterThanOrEqual(5);
      const words = article.sections
        .flatMap((s) => s.blocks)
        .flatMap((b) => (typeof b === 'string' ? [b] : b.list))
        .join(' ')
        .split(/\s+/).length;
      expect(words).toBeGreaterThan(500);
    });
  });

  test('titles and descriptions are unique and search-result sized', () => {
    expect(new Set(ARTICLES.map((a) => a.title)).size).toBe(ARTICLES.length);
    ARTICLES.forEach((article) => {
      expect(article.description.length).toBeGreaterThan(70);
      expect(article.description.length).toBeLessThan(200);
    });
  });
});

describe('house style', () => {
  const fs = require('fs');
  const path = require('path');
  const root = path.join(__dirname, '..');

  // Globbed, not listed. This was a hand written list of twelve files, which
  // covered the project when it was written and silently stopped covering it
  // as files were added: none of the marathon, theme, navigation, footer,
  // predictor or llms.txt sources were checked at all.
  const walk = (dir) =>
    fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) => {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) return e.name === 'og' ? [] : walk(rel);
      return /\.(js|css|html|json|md)$/.test(e.name) ? [rel] : [];
    });

  const files = [...walk('src'), ...walk('scripts'), ...walk('public'), ...walk('docs')]
    // The file defining the rule necessarily contains the characters it bans.
    .filter((f) => f !== 'src/pageData.test.js')
    .concat('CLAUDE.md', 'README.md');

  test('the sweep actually covers the project', () => {
    expect(files.length).toBeGreaterThan(30);
    expect(files).toContain('src/marathons.js');
    expect(files).toContain('src/llmsTxt.js');
    expect(files).toContain('scripts/generate-og-images.js');
  });

  // Em and en dashes read as machine-written prose; the project deliberately
  // uses ordinary punctuation instead.
  test.each(files)('%s uses no em or en dashes', (file) => {
    const contents = fs.readFileSync(path.join(root, file), 'utf8');
    expect(contents).not.toMatch(/[—–]/);
  });
});

import fs from 'fs';
import path from 'path';
import { NAV, sectionFor } from './navigation';
import { allPages } from './pageData';
import { ARTICLES } from './articles';
import { MARATHONS } from './marathons';
import { PREDICTOR_SLUG } from './predictorData';

// Every slug the generator writes a page for, plus the index pages it adds.
const generatedSlugs = new Set([
  ...allPages().map((p) => p.slug),
  ...ARTICLES.map((a) => a.slug),
  ...MARATHONS.map((r) => `marathons/${r.id}`),
  PREDICTOR_SLUG,
  'marathons',
  'pace',
  'guides',
]);

describe('site navigation', () => {
  test('every destination is a page the build writes', () => {
    NAV.forEach((item) => {
      if (item.href === '') return; // the home page
      expect(generatedSlugs.has(item.href.replace(/\/$/, ''))).toBe(true);
    });
  });

  test('hrefs are relative, so they survive being served from a subpath', () => {
    NAV.forEach((item) => expect(item.href.startsWith('/')).toBe(false));
  });

  test('labels and destinations are unique', () => {
    expect(new Set(NAV.map((i) => i.href)).size).toBe(NAV.length);
    expect(new Set(NAV.map((i) => i.label)).size).toBe(NAV.length);
  });

  // The home page shell is hand written rather than generated, so it is the one
  // copy that can silently fall out of step.
  test('the home page shell carries exactly this navigation', () => {
    const shell = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
    const nav = shell.match(/<nav[^>]*data-site-nav[^>]*>([\s\S]*?)<\/nav>/);
    expect(nav).not.toBeNull();
    const hrefs = [...nav[1].matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
    const labels = [...nav[1].matchAll(/>([^<>]+)<\/a>/g)].map((m) => m[1].trim());
    expect(hrefs).toEqual(NAV.map((i) => i.href));
    expect(labels).toEqual(NAV.map((i) => i.label));
  });

  test('marks the section a page belongs to', () => {
    expect(sectionFor('marathons/berlin')).toBe('marathons/');
    expect(sectionFor('pace/sub-3-30-marathon')).toBe('pace/');
    expect(sectionFor('guides/first-marathon')).toBe('guides/');
    expect(sectionFor('predictor')).toBe('predictor/');
    expect(sectionFor('')).toBe('');
  });
});

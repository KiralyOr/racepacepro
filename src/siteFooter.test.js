import fs from 'fs';
import path from 'path';
import { FOOTER_LINES } from './siteFooter';

const shell = () => fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');

describe('site footer', () => {
  test('states the site is independent of the races it names', () => {
    const disclaimer = FOOTER_LINES.join(' ');
    expect(disclaimer).toMatch(/not affiliated with/i);
    expect(disclaimer).toMatch(/endorsed by/i);
    expect(disclaimer).toMatch(/property of their respective organisers/i);
  });

  // The shell copy is hand written, so it is the one that can quietly fall out
  // of step. A disclaimer that exists on 62 pages and not the home page is
  // worse than useless, because the gap is the thing anyone would point at.
  test('the home page shell carries every line verbatim', () => {
    const text = shell().replace(/\s+/g, ' ');
    FOOTER_LINES.forEach((line) => expect(text).toContain(line));
  });
});

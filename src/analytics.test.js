import { analyticsHtml, analyticsTags, GA4_MEASUREMENT_ID } from './analytics';

describe('analytics tags', () => {
  test('ships the cookieless Vercel tag', () => {
    expect(analyticsHtml()).toContain('/_vercel/insights/script.js');
  });

  test('every tag is deferred or async, so none blocks rendering', () => {
    analyticsTags().forEach((tag) => {
      if (tag.includes('src=')) expect(tag).toMatch(/\b(defer|async)\b/);
    });
  });

  // GA4 stays off until someone decides the consent banner is worth it. If this
  // fails, that decision was made, and the consent prompt needs to exist too.
  test('Google Analytics is off by default', () => {
    expect(GA4_MEASUREMENT_ID).toBeNull();
    expect(analyticsHtml()).not.toContain('googletagmanager');
  });
});

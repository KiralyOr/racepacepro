import { MARATHONS, marathonById } from './marathons';

describe('marathon data', () => {
  test('ids are unique and URL safe', () => {
    const ids = MARATHONS.map((race) => race.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z0-9-]+$/));
  });

  test('lookup finds a race and misses cleanly', () => {
    expect(marathonById('berlin').city).toBe('Berlin');
    expect(marathonById('atlantis')).toBeUndefined();
  });

  test('every race carries an https official link', () => {
    MARATHONS.forEach((race) => expect(race.officialUrl).toMatch(/^https:\/\//));
  });

  test('every race has substantial, distinct pacing content', () => {
    MARATHONS.forEach((race) => {
      expect(race.pacing.length).toBeGreaterThanOrEqual(3);
      expect(race.watchFor.length).toBeGreaterThanOrEqual(3);
      expect(race.pacing.join(' ').split(/\s+/).length).toBeGreaterThan(120);
    });

    const summaries = MARATHONS.map((race) => race.summary);
    expect(new Set(summaries).size).toBe(summaries.length);
  });
});

// The whole reason these pages exist in this form: this project cannot verify
// race dates, so it publishes none. A wrong ballot deadline is the worst
// failure this site could have, and this test stops one creeping back in.
describe('no time sensitive claims', () => {
  const prose = (race) => [race.summary, ...race.pacing, ...race.watchFor].join(' ');

  test.each(MARATHONS.map((race) => [race.name, race]))('%s states no year', (_name, race) => {
    expect(prose(race)).not.toMatch(/\b(19|20)\d{2}\b/);
  });

  test.each(MARATHONS.map((race) => [race.name, race]))('%s states no calendar date', (_name, race) => {
    expect(prose(race)).not.toMatch(
      /\b\d{1,2}(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December)\b/i
    );
    expect(prose(race)).not.toMatch(/\b\d{4}-\d{2}-\d{2}\b/);
  });

  test('month is a bare month name, not a date', () => {
    MARATHONS.forEach((race) =>
      expect(race.month).toMatch(
        /^(January|February|March|April|May|June|July|August|September|October|November|December)$/
      )
    );
  });
});

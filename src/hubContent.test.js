import { POPULAR_DISTANCES_KM, RIEGEL_STANDARD, predictTime } from './paceMath';
import { HUB_CONTENT, hubContentFor, penaltyPercent, stepUpPenalty } from './hubContent';
import { RACES } from './pageData';

describe('step up penalty', () => {
  // Derived rather than asserted against a magic number: the penalty must be
  // exactly what the predictor implies, or the prose and the tool disagree.
  test('agrees with what the predictor would produce', () => {
    const from = POPULAR_DISTANCES_KM['Half Marathon'];
    const to = POPULAR_DISTANCES_KM.Marathon;
    const knownSeconds = 5400;
    const predicted = predictTime(knownSeconds, from, to, RIEGEL_STANDARD);
    const paceRatio = predicted / to / (knownSeconds / from);
    expect(stepUpPenalty(from, to)).toBeCloseTo(paceRatio - 1, 12);
  });

  test('is zero for the same distance and grows with the step', () => {
    expect(stepUpPenalty(10, 10)).toBeCloseTo(0, 12);
    expect(stepUpPenalty(5, 10)).toBeGreaterThan(0);
    expect(stepUpPenalty(5, 42.195)).toBeGreaterThan(stepUpPenalty(5, 10));
  });

  test('formats as a percentage to one decimal', () => {
    expect(penaltyPercent(5, 10)).toMatch(/^\d+\.\d%$/);
  });
});

describe('hub content', () => {
  test('every race hub has content', () => {
    RACES.forEach((race) => expect(hubContentFor(race.id)).not.toBeNull());
    expect(Object.keys(HUB_CONTENT).sort()).toEqual(RACES.map((r) => r.id).sort());
  });

  test('unknown race returns null rather than undefined behaviour', () => {
    expect(hubContentFor('ultra')).toBeNull();
  });

  test('each hub carries substantial pacing prose', () => {
    Object.entries(HUB_CONTENT).forEach(([id, content]) => {
      expect(content.pacing.length).toBeGreaterThanOrEqual(3);
      const words = content.pacing.join(' ').split(/\s+/).length;
      expect({ id, words }).toEqual({ id, words: expect.any(Number) });
      expect(words).toBeGreaterThan(180);
    });
  });

  test('each hub lists mistakes and answers questions', () => {
    Object.values(HUB_CONTENT).forEach((content) => {
      expect(content.mistakes.length).toBeGreaterThanOrEqual(3);
      expect(content.faq.length).toBeGreaterThanOrEqual(3);
      content.faq.forEach((item) => {
        expect(item.question).toMatch(/\?$/);
        expect(item.answer.split(/\s+/).length).toBeGreaterThan(15);
      });
    });
  });

  test('content is distinct between distances, not a template', () => {
    const all = Object.values(HUB_CONTENT).flatMap((c) => c.pacing);
    expect(new Set(all).size).toBe(all.length);
    const questions = Object.values(HUB_CONTENT).flatMap((c) => c.faq.map((f) => f.question));
    // "How far is X in miles" repeats by design; everything else must not.
    const others = questions.filter((q) => !q.startsWith('How far'));
    expect(new Set(others).size).toBe(others.length);
  });

  test('quoted distances match paceMath rather than being typed in', () => {
    expect(hubContentFor('marathon').faq[0].answer).toContain(String(POPULAR_DISTANCES_KM.Marathon));
    expect(hubContentFor('5k').faq[0].answer).toContain(
      (POPULAR_DISTANCES_KM['5K'] / 1.609344).toFixed(2)
    );
  });
});

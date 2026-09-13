import {
  GOALS,
  LEVELS,
  addWeeks,
  fallbackGoal,
  planFor,
  weeksBetween,
  weeksNeeded,
} from './trainingPlan';

const day = (y, m, d) => new Date(y, m - 1, d);

describe('weeksNeeded', () => {
  test('a longer race from the same base takes longer', () => {
    const level = 'casual';
    const ladder = GOALS.map((g) => weeksNeeded(level, g.id));
    expect([...ladder].sort((a, b) => a - b)).toEqual(ladder);
  });

  test('a stronger base shortens the build', () => {
    expect(weeksNeeded('none', 'marathon')).toBeGreaterThan(weeksNeeded('half', 'marathon'));
    expect(weeksNeeded('half', 'marathon')).toBeGreaterThan(weeksNeeded('marathon', 'marathon'));
  });

  test('every level and goal pairing is defined', () => {
    LEVELS.forEach((level) =>
      GOALS.forEach((goal) => expect(weeksNeeded(level.id, goal.id)).toBeGreaterThan(0))
    );
  });

  test('a time target adds weeks', () => {
    expect(weeksNeeded('half', 'marathon', true)).toBeGreaterThan(
      weeksNeeded('half', 'marathon', false)
    );
  });

  test('an unknown pairing yields nothing rather than a guess', () => {
    expect(weeksNeeded('astronaut', 'marathon')).toBeNull();
    expect(weeksNeeded('half', 'ultra')).toBeNull();
  });
});

describe('date arithmetic', () => {
  test('counts back the right number of weeks', () => {
    expect(addWeeks(day(2026, 12, 6), -18)).toEqual(day(2026, 8, 2));
  });

  test('crosses a year boundary', () => {
    expect(addWeeks(day(2027, 1, 10), -6)).toEqual(day(2026, 11, 29));
  });

  test('measures whole weeks between dates', () => {
    expect(weeksBetween(day(2026, 9, 13), day(2026, 12, 6))).toBe(12);
  });
});

describe('planFor', () => {
  const today = day(2026, 9, 13);

  test('a half marathon finisher has time for a marathon a year out', () => {
    const plan = planFor({ today, raceDate: day(2027, 9, 12), level: 'half', goal: 'marathon' });
    expect(plan.verdict).toBe('comfortable');
    expect(plan.needed).toBe(18);
    // 18 weeks is 126 days back from 12 September 2027.
    expect(plan.startBy).toEqual(day(2027, 5, 9));
  });

  test('a non-runner cannot build a marathon in twelve weeks', () => {
    const plan = planFor({ today, raceDate: day(2026, 12, 6), level: 'none', goal: 'marathon' });
    expect(plan.verdict).toBe('short');
    expect(plan.shortfall).toBeGreaterThan(4);
  });

  test('flags a build that is only just short', () => {
    // 18 weeks needed, 16 available.
    const plan = planFor({ today, raceDate: day(2027, 1, 3), level: 'half', goal: 'marathon' });
    expect(plan.verdict).toBe('tight');
    expect(plan.shortfall).toBe(2);
  });

  test('rejects a date in the past', () => {
    const plan = planFor({ today, raceDate: day(2026, 1, 1), level: 'half', goal: 'marathon' });
    expect(plan.verdict).toBe('past');
  });

  test('returns nothing for an unparseable date', () => {
    expect(planFor({ today, raceDate: new Date('nonsense'), level: 'half', goal: 'marathon' })).toBeNull();
  });
});

describe('fallbackGoal', () => {
  test('steps down one distance', () => {
    expect(fallbackGoal('marathon')).toBe('half');
    expect(fallbackGoal('half')).toBe('10k');
  });

  test('has nothing below the shortest race', () => {
    expect(fallbackGoal('5k')).toBeNull();
  });
});

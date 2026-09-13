import {
  KM_PER_MILE,
  POPULAR_DISTANCES_KM,
  RIEGEL_CONSERVATIVE,
  RIEGEL_STANDARD,
  buildSplits,
  convertPace,
  formatClock,
  formatPace,
  joinTime,
  kmToUnit,
  paceFromTotalTime,
  predictAll,
  predictTime,
  splitPace,
  splitTime,
  totalTimeFromPace,
  unitToKm,
  zoneForPace,
} from './paceMath';

describe('distance conversion', () => {
  test('round-trips between units', () => {
    expect(kmToUnit(unitToKm(26.2, 'mi'), 'mi')).toBeCloseTo(26.2, 10);
  });

  test('leaves kilometres untouched', () => {
    expect(kmToUnit(42.195, 'km')).toBe(42.195);
    expect(unitToKm(42.195, 'km')).toBe(42.195);
  });

  test('converts a marathon to miles', () => {
    expect(kmToUnit(POPULAR_DISTANCES_KM.Marathon, 'mi')).toBeCloseTo(26.2188, 3);
  });
});

describe('convertPace', () => {
  test('a mile takes longer than a kilometre at the same effort', () => {
    expect(convertPace(300, 'km', 'mi')).toBeCloseTo(300 * KM_PER_MILE, 10);
  });

  test('is reversible', () => {
    expect(convertPace(convertPace(300, 'km', 'mi'), 'mi', 'km')).toBeCloseTo(300, 10);
  });

  test('is a no-op for the same unit', () => {
    expect(convertPace(300, 'km', 'km')).toBe(300);
  });
});

describe('splitTime', () => {
  test('splits into hours, minutes and seconds', () => {
    expect(splitTime(12659)).toEqual({ hours: 3, minutes: 30, seconds: 59 });
  });

  test('never renders a 60 in the seconds slot', () => {
    expect(splitTime(3599.7)).toEqual({ hours: 1, minutes: 0, seconds: 0 });
  });

  test('clamps negatives to zero', () => {
    expect(splitTime(-10)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });

  test('round-trips through joinTime', () => {
    expect(joinTime(splitTime(4271))).toBe(4271);
  });
});

describe('splitPace', () => {
  test('splits into minutes and seconds', () => {
    expect(splitPace(300)).toEqual({ minutes: 5, seconds: 0 });
  });

  test('never renders a 60 in the seconds slot', () => {
    expect(splitPace(119.6)).toEqual({ minutes: 2, seconds: 0 });
  });
});

describe('pace and time are inverses', () => {
  test('5K at 5:00/km takes 25 minutes', () => {
    expect(totalTimeFromPace(300, POPULAR_DISTANCES_KM['5K'])).toBe(1500);
  });

  test('25 minutes over 5K is a 5:00/km pace', () => {
    expect(paceFromTotalTime(1500, POPULAR_DISTANCES_KM['5K'])).toBe(300);
  });

  test('a zero distance yields no pace rather than Infinity', () => {
    expect(paceFromTotalTime(1500, 0)).toBe(0);
  });
});

describe('formatting', () => {
  test('drops the hour field when under an hour', () => {
    expect(formatClock(1500)).toBe('25:00');
  });

  test('shows hours when there are any', () => {
    expect(formatClock(12659)).toBe('3:30:59');
  });

  test('pads pace seconds', () => {
    expect(formatPace(303)).toBe('5:03');
  });
});

describe('zoneForPace', () => {
  test('classifies paces given in kilometres', () => {
    expect(zoneForPace(200, 'km').id).toBe('interval');
    expect(zoneForPace(270, 'km').id).toBe('threshold');
    expect(zoneForPace(300, 'km').id).toBe('steady');
    expect(zoneForPace(360, 'km').id).toBe('easy');
    expect(zoneForPace(500, 'km').id).toBe('recovery');
  });

  test('converts a mile pace before classifying', () => {
    // 8:03/mile is 5:00/km, which is steady, not the recovery pace the raw
    // number would suggest against per-kilometre boundaries.
    expect(zoneForPace(483, 'mi').id).toBe('steady');
    expect(zoneForPace(483, 'km').id).toBe('recovery');
  });

  test('is undefined for a nonsense pace', () => {
    expect(zoneForPace(0, 'km')).toBeNull();
    expect(zoneForPace(NaN, 'km')).toBeNull();
  });
});

describe('buildSplits', () => {
  test('marks every unit plus the finish', () => {
    const splits = buildSplits(5, 1500);
    expect(splits.map((s) => s.distance)).toEqual([1, 2, 3, 4, 5]);
    expect(splits.map((s) => s.seconds)).toEqual([300, 600, 900, 1200, 1500]);
    expect(splits[4].isFinish).toBe(true);
  });

  test('includes a partial final split', () => {
    const splits = buildSplits(42.195, 12658.5);
    expect(splits[splits.length - 1].distance).toBe(42.195);
    expect(splits[splits.length - 1].seconds).toBeCloseTo(12658.5, 6);
  });

  test('a negative split keeps the finish time but front-loads the effort', () => {
    const total = 3000;
    const splits = buildSplits(10, total, 0.02);
    const finish = splits[splits.length - 1];
    const halfway = splits.find((s) => s.distance === 5);

    expect(finish.seconds).toBeCloseTo(total, 6);
    expect(halfway.seconds).toBeGreaterThan(total / 2);
  });

  test('caps the row count so a huge distance cannot lock the page', () => {
    expect(buildSplits(100000, 360000).length).toBeLessThanOrEqual(61);
  });

  test('returns nothing for a distance or time of zero', () => {
    expect(buildSplits(0, 1500)).toEqual([]);
    expect(buildSplits(5, 0)).toEqual([]);
    expect(buildSplits(NaN, 1500)).toEqual([]);
  });
});

describe('switching units preserves the finish time', () => {
  test.each(Object.entries(POPULAR_DISTANCES_KM))('%s', (_name, km) => {
    const pacePerKm = 300;
    const inKm = totalTimeFromPace(pacePerKm, km);
    const inMiles = totalTimeFromPace(
      convertPace(pacePerKm, 'km', 'mi'),
      kmToUnit(km, 'mi')
    );

    expect(inMiles).toBeCloseTo(inKm, 6);
  });
});

describe('race time prediction', () => {
  // The worked example in guides/marathon-goal-time. If this drifts, the guide
  // and the tool are telling a reader two different things.
  test('reproduces the worked example from the goal time guide', () => {
    const half = joinTime({ hours: 1, minutes: 45, seconds: 0 });
    const predicted = predictTime(half, POPULAR_DISTANCES_KM['Half Marathon'], POPULAR_DISTANCES_KM.Marathon);
    expect(formatClock(Math.round(predicted))).toBe('3:38:55');
  });

  test('predicting the distance you ran returns the time you ran', () => {
    const time = joinTime({ hours: 0, minutes: 22, seconds: 30 });
    expect(predictTime(time, 5, 5)).toBeCloseTo(time, 6);
  });

  test('a longer target is always slower per kilometre', () => {
    const time = joinTime({ hours: 0, minutes: 20, seconds: 0 });
    const rows = predictAll(time, 5);
    const paces = rows.map((r) => r.pacePerKm);
    paces.slice(1).forEach((pace, i) => expect(pace).toBeGreaterThan(paces[i]));
  });

  test('the conservative exponent predicts a slower marathon than the standard one', () => {
    const half = joinTime({ hours: 1, minutes: 30, seconds: 0 });
    const km = POPULAR_DISTANCES_KM['Half Marathon'];
    const marathon = POPULAR_DISTANCES_KM.Marathon;
    expect(predictTime(half, km, marathon, RIEGEL_CONSERVATIVE)).toBeGreaterThan(
      predictTime(half, km, marathon, RIEGEL_STANDARD)
    );
  });

  test('marks the row the prediction came from', () => {
    const rows = predictAll(1200, 5);
    expect(rows.filter((r) => r.isSource).map((r) => r.name)).toEqual(['5K']);
  });

  test('rejects nonsense input rather than returning a number', () => {
    expect(predictTime(0, 5, 10)).toBeNull();
    expect(predictTime(1200, 0, 10)).toBeNull();
    expect(predictTime(1200, 5, -1)).toBeNull();
    expect(predictTime(NaN, 5, 10)).toBeNull();
  });
});

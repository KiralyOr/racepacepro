import { POPULAR_DISTANCES_KM, RIEGEL_CONSERVATIVE, formatClock } from './paceMath';
import { PREDICTOR_PAGE, predictorTables } from './predictorData';

describe('predictor tables', () => {
  const tables = predictorTables();

  test('covers every distance as a source', () => {
    expect(tables.map((t) => t.source)).toEqual(Object.keys(POPULAR_DISTANCES_KM));
  });

  test('never predicts a distance from itself', () => {
    tables.forEach((table) => {
      expect(table.targets).not.toContain(table.source);
      expect(table.targets).toHaveLength(Object.keys(POPULAR_DISTANCES_KM).length - 1);
      table.rows.forEach((row) => expect(row.predictions).toHaveLength(table.targets.length));
    });
  });

  test('a slower source time predicts slower everywhere', () => {
    tables.forEach((table) => {
      table.rows.slice(1).forEach((row, i) => {
        const previous = table.rows[i];
        expect(row.seconds).toBeGreaterThan(previous.seconds);
        row.predictions.forEach((value, col) =>
          expect(value).toBeGreaterThan(previous.predictions[col])
        );
      });
    });
  });

  // The figure quoted in guides/marathon-goal-time, reached through the page
  // data rather than the raw function, so the published table is what is checked.
  test('the 1:45 half row predicts the marathon the guide quotes', () => {
    const half = tables.find((t) => t.source === 'Half Marathon');
    const row = half.rows.find((r) => r.seconds === 105 * 60);
    const marathon = row.predictions[half.targets.indexOf('Marathon')];
    expect(formatClock(Math.round(marathon))).toBe('3:38:55');
  });

  test('the conservative exponent is slower across the board', () => {
    const conservative = predictorTables(RIEGEL_CONSERVATIVE);
    const standardHalf = tables.find((t) => t.source === '5K');
    const conservativeHalf = conservative.find((t) => t.source === '5K');
    const col = standardHalf.targets.indexOf('Marathon');
    standardHalf.rows.forEach((row, i) => {
      expect(conservativeHalf.rows[i].predictions[col]).toBeGreaterThan(row.predictions[col]);
    });
  });

  test('page metadata is search-result sized', () => {
    expect(PREDICTOR_PAGE.title.length).toBeLessThanOrEqual(65);
    expect(PREDICTOR_PAGE.description.length).toBeGreaterThan(70);
    expect(PREDICTOR_PAGE.description.length).toBeLessThanOrEqual(165);
  });
});

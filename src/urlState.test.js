import { DEFAULT_STATE, decodeState, encodeState } from './urlState';

const sample = {
  selectedKey: 'Marathon',
  customValue: '5',
  unit: 'mi',
  mode: 'timeFromPace',
  paceSeconds: 483,
  totalSeconds: 12659,
  strategy: 'neg1',
};

describe('encode/decode round trip', () => {
  test('preserves a preset distance and pace', () => {
    const decoded = decodeState(encodeState(sample));
    expect(decoded.selectedKey).toBe('Marathon');
    expect(decoded.unit).toBe('mi');
    expect(decoded.mode).toBe('timeFromPace');
    expect(decoded.paceSeconds).toBe(483);
    expect(decoded.strategy).toBe('neg1');
  });

  test('preserves a custom distance', () => {
    const decoded = decodeState(encodeState({ ...sample, selectedKey: 'custom', customValue: '7.5' }));
    expect(decoded.selectedKey).toBe('custom');
    expect(decoded.customValue).toBe('7.5');
  });

  test('carries total time in time-first mode', () => {
    const decoded = decodeState(encodeState({ ...sample, mode: 'paceFromTime' }));
    expect(decoded.mode).toBe('paceFromTime');
    expect(decoded.totalSeconds).toBe(12659);
  });

  test('omits the strategy when even', () => {
    expect(encodeState({ ...sample, strategy: 'even' })).not.toContain('s=');
  });
});

describe('decoding untrusted input', () => {
  test('returns null when there is nothing to read', () => {
    expect(decodeState('')).toBeNull();
    expect(decodeState(null)).toBeNull();
  });

  test('falls back on a non-numeric distance', () => {
    const decoded = decodeState('?d=<script>alert(1)</script>');
    expect(decoded.selectedKey).toBe(DEFAULT_STATE.selectedKey);
  });

  test('falls back on a non-numeric pace', () => {
    expect(decodeState('?p=abc').paceSeconds).toBe(DEFAULT_STATE.paceSeconds);
  });

  test('rejects an out-of-range pace', () => {
    expect(decodeState('?p=-5').paceSeconds).toBe(DEFAULT_STATE.paceSeconds);
    expect(decodeState('?p=999999999').paceSeconds).toBe(DEFAULT_STATE.paceSeconds);
  });

  test('rejects an absurd custom distance', () => {
    expect(decodeState('?d=999999999').selectedKey).toBe(DEFAULT_STATE.selectedKey);
  });

  test('falls back on an unknown unit or strategy', () => {
    const decoded = decodeState('?u=parsecs&s=rocket');
    expect(decoded.unit).toBe('km');
    expect(decoded.strategy).toBe('even');
  });
});

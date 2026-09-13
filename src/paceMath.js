export const KM_PER_MILE = 1.609344;

export const POPULAR_DISTANCES_KM = {
  '5K': 5,
  '10K': 10,
  'Half Marathon': 21.0975,
  Marathon: 42.195,
};

export const kmToUnit = (km, unit) => (unit === 'mi' ? km / KM_PER_MILE : km);

export const unitToKm = (value, unit) => (unit === 'mi' ? value * KM_PER_MILE : value);

// Pace is seconds per unit of distance, so it scales with the unit, not against it:
// a mile takes longer to cover than a kilometre.
export const convertPace = (paceSeconds, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return paceSeconds;
  return toUnit === 'mi' ? paceSeconds * KM_PER_MILE : paceSeconds / KM_PER_MILE;
};

export const splitTime = (totalSeconds) => {
  const safe = Math.max(0, Math.round(totalSeconds));
  return {
    hours: Math.floor(safe / 3600),
    minutes: Math.floor((safe % 3600) / 60),
    seconds: safe % 60,
  };
};

export const splitPace = (paceSeconds) => {
  const safe = Math.max(0, Math.round(paceSeconds));
  return {
    minutes: Math.floor(safe / 60),
    seconds: safe % 60,
  };
};

export const joinTime = ({ hours, minutes, seconds }) => hours * 3600 + minutes * 60 + seconds;

export const totalTimeFromPace = (paceSecondsPerUnit, distanceInUnit) =>
  paceSecondsPerUnit * distanceInUnit;

export const paceFromTotalTime = (totalSeconds, distanceInUnit) =>
  distanceInUnit > 0 ? totalSeconds / distanceInUnit : 0;

// Boundaries are seconds per kilometre; a pace given in miles is converted
// before classifying. These are a broad guide only. Real training zones are
// individual and derive from a recent race or threshold test, which is why the
// UI says so wherever a zone is shown.
export const PACE_ZONES = [
  { id: 'interval', label: 'Interval', maxSecondsPerKm: 240 },
  { id: 'threshold', label: 'Threshold', maxSecondsPerKm: 285 },
  { id: 'steady', label: 'Steady', maxSecondsPerKm: 330 },
  { id: 'easy', label: 'Easy', maxSecondsPerKm: 390 },
  { id: 'recovery', label: 'Recovery', maxSecondsPerKm: Infinity },
];

export const zoneForPace = (paceSeconds, unit = 'km') => {
  const perKm = unit === 'mi' ? paceSeconds / KM_PER_MILE : paceSeconds;
  if (!Number.isFinite(perKm) || perKm <= 0) return null;
  return PACE_ZONES.find((zone) => perKm < zone.maxSecondsPerKm);
};

// How much faster the second half is run than the first, as a percentage.
// Zero is even effort. Past about 5% the first half is so conservative that
// the plan stops resembling a race.
export const MAX_NEGATIVE_SPLIT_PCT = 5;
export const NEGATIVE_SPLIT_STEP = 0.5;

export const negativeSplitOptions = () => {
  const steps = [];
  for (let pct = 0; pct <= MAX_NEGATIVE_SPLIT_PCT + 1e-9; pct += NEGATIVE_SPLIT_STEP) {
    steps.push(Math.round(pct * 2) / 2);
  }
  return steps;
};

export const clampNegativeSplitPct = (value) => {
  const pct = Number(value);
  if (!Number.isFinite(pct)) return 0;
  const snapped = Math.round(pct / NEGATIVE_SPLIT_STEP) * NEGATIVE_SPLIT_STEP;
  return Math.min(MAX_NEGATIVE_SPLIT_PCT, Math.max(0, snapped));
};

// Cap the row count so an absurd custom distance can't generate a table
// long enough to lock up the page.
const MAX_SPLIT_ROWS = 60;

// Cumulative elapsed time at each split marker. A negative split runs the
// second half `fraction` faster than the first, holding total time constant:
//   T = half*p1 + half*p1*(1 - fraction)  =>  p1 = T / (half * (2 - fraction))
export const buildSplits = (distanceInUnit, totalSeconds, fraction = 0) => {
  if (!Number.isFinite(distanceInUnit) || distanceInUnit <= 0) return [];
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return [];

  const half = distanceInUnit / 2;
  const firstPace = totalSeconds / (half * (2 - fraction));
  const secondPace = firstPace * (1 - fraction);
  const elapsedAt = (d) =>
    d <= half ? d * firstPace : half * firstPace + (d - half) * secondPace;

  const step = Math.max(1, Math.ceil(distanceInUnit / MAX_SPLIT_ROWS));
  const markers = [];
  for (let d = step; d < distanceInUnit; d += step) markers.push(d);
  markers.push(distanceInUnit);

  return markers.map((distance) => ({
    distance,
    seconds: elapsedAt(distance),
    isFinish: distance === distanceInUnit,
  }));
};

export const formatClock = (totalSeconds) => {
  const { hours, minutes, seconds } = splitTime(totalSeconds);
  const pad = (n) => String(n).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
};

export const formatPace = (paceSeconds) => {
  const { minutes, seconds } = splitPace(paceSeconds);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

// Race time prediction, using Riegel's formula:
//
//   predicted = known x (target distance / known distance) ^ exponent
//
// The exponent is the whole idea. At 1.0 you would hold the same pace forever,
// which nobody does. Above 1.0 it models slowing down as the distance grows.
export const RIEGEL_STANDARD = 1.06;

// Riegel assumes you are equally trained for both distances, which is rarely
// true of the marathon. The higher exponent is the more conservative reading
// coaches use for anyone who has not done marathon specific long runs, and it
// matches what guides/marathon-goal-time says in prose.
export const RIEGEL_CONSERVATIVE = 1.08;

export const RIEGEL_EXPONENTS = [
  {
    id: 'standard',
    value: RIEGEL_STANDARD,
    label: 'Standard',
    note: 'Assumes you are equally trained for both distances.',
  },
  {
    id: 'conservative',
    value: RIEGEL_CONSERVATIVE,
    label: 'Conservative',
    note: 'More realistic if you have not built marathon specific endurance.',
  },
];

export const predictTime = (knownSeconds, knownKm, targetKm, exponent = RIEGEL_STANDARD) => {
  if (!(knownSeconds > 0) || !(knownKm > 0) || !(targetKm > 0)) return null;
  return knownSeconds * Math.pow(targetKm / knownKm, exponent);
};

// Every standard distance predicted from one result. The distance the result
// came from is included and marked, because seeing your actual time sitting in
// the row it was derived from is what makes the rest of the table legible.
export const predictAll = (knownSeconds, knownKm, exponent = RIEGEL_STANDARD) =>
  Object.entries(POPULAR_DISTANCES_KM).map(([name, km]) => {
    const seconds = predictTime(knownSeconds, knownKm, km, exponent);
    return {
      name,
      km,
      seconds,
      pacePerKm: seconds === null ? null : seconds / km,
      isSource: Math.abs(km - knownKm) < 0.001,
    };
  });

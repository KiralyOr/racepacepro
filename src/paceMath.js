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

export const SPLIT_STRATEGIES = [
  { id: 'even', label: 'Even', fraction: 0 },
  { id: 'neg1', label: 'Negative 1%', fraction: 0.01 },
  { id: 'neg2', label: 'Negative 2%', fraction: 0.02 },
];

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

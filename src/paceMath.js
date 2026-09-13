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

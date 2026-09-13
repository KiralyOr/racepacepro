import {
  KM_PER_MILE,
  POPULAR_DISTANCES_KM,
  buildSplits,
  formatClock,
  formatPace,
  paceFromTotalTime,
  zoneForPace,
} from './paceMath';

export const SITE_ORIGIN = 'https://racepacepro.com';

export const RACES = [
  { id: '5k', name: '5K', km: POPULAR_DISTANCES_KM['5K'], calcSlug: '5k' },
  { id: '10k', name: '10K', km: POPULAR_DISTANCES_KM['10K'], calcSlug: '10k' },
  {
    id: 'half-marathon',
    name: 'Half Marathon',
    km: POPULAR_DISTANCES_KM['Half Marathon'],
    calcSlug: 'half',
  },
  { id: 'marathon', name: 'Marathon', km: POPULAR_DISTANCES_KM.Marathon, calcSlug: 'marathon' },
];

// Goal times people actually search for, per distance. Deliberately a modest
// set of meaningfully different targets rather than every permutation — a wall
// of near-identical pages is a ranking liability, not an asset.
export const GOAL_SECONDS = {
  '5k': [900, 1080, 1200, 1320, 1500, 1800, 2100],
  '10k': [2100, 2400, 2700, 3000, 3300, 3600, 4200],
  'half-marathon': [4800, 5400, 6000, 6300, 6600, 7200, 8100, 9000],
  marathon: [9900, 10800, 11700, 12600, 13500, 14400, 16200, 18000],
};

// "20" under an hour, "3:30" at or over one — matching how the goal is spoken
// and searched ("sub 20 5k", "sub 3:30 marathon").
export const goalLabel = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}` : String(minutes);
};

export const goalSlug = (seconds) => `sub-${goalLabel(seconds).replace(':', '-')}`;

const splitTables = (race, totalSeconds) => ({
  km: buildSplits(race.km, totalSeconds),
  mi: buildSplits(race.km / KM_PER_MILE, totalSeconds),
});

export const goalPage = (race, totalSeconds) => {
  const perKm = paceFromTotalTime(totalSeconds, race.km);
  const perMile = paceFromTotalTime(totalSeconds, race.km / KM_PER_MILE);
  const label = goalLabel(totalSeconds);
  const name = `Sub-${label} ${race.name}`;

  return {
    type: 'goal',
    slug: `pace/${goalSlug(totalSeconds)}-${race.id}`,
    race,
    totalSeconds,
    label,
    name,
    perKm,
    perMile,
    zone: zoneForPace(perKm),
    splits: splitTables(race, totalSeconds),
    title: `${name} Pace and Splits`,
    description:
      `To run a sub-${label} ${race.name.toLowerCase()} you need ${formatPace(perKm)} per km ` +
      `(${formatPace(perMile)} per mile). Full split table and pacing guidance.`,
    heading: `${name} pace`,
    calculatorQuery: `?d=${race.calcSlug}&u=km&m=time&t=${totalSeconds}`,
  };
};

export const hubPage = (race) => ({
  type: 'hub',
  slug: `pace/${race.id}`,
  race,
  goals: GOAL_SECONDS[race.id].map((seconds) => goalPage(race, seconds)),
  title: `${race.name} Pace Chart — Times, Splits and Paces`,
  description:
    `${race.name} pace chart: the pace needed for every common goal time, in minutes per ` +
    `kilometre and per mile, with full split tables.`,
  heading: `${race.name} pace chart`,
  calculatorQuery: `?d=${race.calcSlug}&u=km&m=pace&p=300`,
});

export const allPages = () => [
  ...RACES.map(hubPage),
  ...RACES.flatMap((race) => GOAL_SECONDS[race.id].map((seconds) => goalPage(race, seconds))),
];

export const summarise = (page) =>
  page.type === 'goal'
    ? `${page.name}: ${formatPace(page.perKm)}/km, ${formatClock(page.totalSeconds)}`
    : `${page.race.name} hub (${page.goals.length} goals)`;

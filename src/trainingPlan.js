// How long it takes to get from where someone is to a given race, and
// therefore the date they need to start.
//
// The week counts are conventional coaching guidelines, not results from a
// study. They assume training goes roughly to plan, which is why the UI frames
// the answer as a start date to aim for rather than a promise.

export const LEVELS = [
  { id: 'none', label: 'Not running at present' },
  { id: 'casual', label: 'Run occasionally, 30 minutes is comfortable' },
  { id: '5k', label: 'Finished a 5K, run most weeks' },
  { id: '10k', label: 'Finished a 10K' },
  { id: 'half', label: 'Finished a half marathon' },
  { id: 'marathon', label: 'Finished a marathon' },
];

export const GOALS = [
  { id: '5k', label: '5K' },
  { id: '10k', label: '10K' },
  { id: 'half', label: 'Half marathon' },
  { id: 'marathon', label: 'Marathon' },
];

// Weeks from today to race day, by starting level and target race. The jump
// from "not running" to a marathon is the longest because it is two projects:
// build a base first, then run a marathon block on top of it.
const WEEKS = {
  '5k': { none: 12, casual: 8, '5k': 6, '10k': 6, half: 6, marathon: 6 },
  '10k': { none: 16, casual: 12, '5k': 10, '10k': 8, half: 8, marathon: 8 },
  half: { none: 24, casual: 18, '5k': 16, '10k': 12, half: 12, marathon: 12 },
  marathon: { none: 40, casual: 30, '5k': 24, '10k': 20, half: 18, marathon: 16 },
};

// A demanding time target needs more weeks than simply covering the distance.
// Only applied when the runner has named a goal time.
const AMBITION_WEEKS = 4;

export const weeksNeeded = (level, goal, ambitious = false) => {
  const base = WEEKS[goal]?.[level];
  if (base === undefined) return null;
  return ambitious ? base + AMBITION_WEEKS : base;
};

export const addWeeks = (date, weeks) => {
  const out = new Date(date.getTime());
  out.setDate(out.getDate() + weeks * 7);
  return out;
};

export const weeksBetween = (from, to) =>
  Math.floor((to.getTime() - from.getTime()) / (7 * 24 * 60 * 60 * 1000));

export const formatDate = (date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Given today, a race date and a starting point, work out whether there is
// enough runway and what to do about it if not.
export const planFor = ({ today, raceDate, level, goal, ambitious }) => {
  const needed = weeksNeeded(level, goal, ambitious);
  if (needed === null || !(raceDate instanceof Date) || Number.isNaN(raceDate.getTime())) {
    return null;
  }

  const available = weeksBetween(today, raceDate);
  const startBy = addWeeks(raceDate, -needed);
  const shortfall = needed - available;

  let verdict;
  if (available < 0) verdict = 'past';
  else if (shortfall <= 0) verdict = 'comfortable';
  else if (shortfall <= 4) verdict = 'tight';
  else verdict = 'short';

  return { needed, available, startBy, shortfall, verdict, goal, level };
};

// What to suggest when the runway is not there. Dropping to a shorter distance
// is nearly always the better answer than compressing a plan.
export const fallbackGoal = (goal) => {
  const order = ['5k', '10k', 'half', 'marathon'];
  const index = order.indexOf(goal);
  return index > 0 ? order[index - 1] : null;
};

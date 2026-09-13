// Content for the home page below the calculator.
//
// It lives here rather than in a React component because the app is client
// rendered: anything React draws is invisible to a crawler that does not
// execute JavaScript, and the home page is the one URL most worth ranking.
// scripts/generate-pages.js writes this into build/index.html as plain HTML,
// and derives the FAQPage structured data from the same array, so the schema
// cannot drift from what is on the page.

export const ABOUT = [
  'Race Pace Pro works in both directions. Enter a target pace to see the finish time it produces, or enter a goal time to see the pace you need to hold. Pick a standard race distance or type your own, switch freely between kilometres and miles, and the split table shows the elapsed time you should see at every marker along the way.',
  'Everything runs in your browser. Nothing is uploaded, and the link you copy carries your settings so you can send a pacing plan to a training partner.',
];

export const FAQ = [
  {
    question: 'How do I convert min/km to min/mile?',
    answer:
      'Multiply by 1.609. A 5:00/km pace is 8:03/mile; to go the other way, divide by 1.609. Switching units does this for you, and your finish time stays the same, because the distance has not changed, only the units it is described in.',
  },
  {
    question: 'What do the pace zones mean?',
    answer:
      'They are a rough guide to training intensity, from recovery jogging up to interval pace. Treat them loosely: real training zones are individual and are normally set from a recent race result or a threshold test, so the same pace can be easy for one runner and hard for another.',
  },
  {
    question: 'What is a good 5K time?',
    answer:
      'It depends heavily on age, sex and training history, so treat any single number with suspicion. As rough orientation for adults: 30 to 35 minutes is a common first-timer result, under 25 minutes suggests consistent training, and under 20 minutes is competitive club standard. Beating your own previous time is a more useful measure than any table.',
  },
  {
    question: 'What is a negative split?',
    answer:
      'Running the second half of a race faster than the first. Most personal bests are run this way and most blow-ups come from starting too fast, so it is a common strategy. Set a negative split percentage in the split table to see the pacing it implies for the same finish time.',
  },
  {
    question: 'Why does my actual race time not match the calculator?',
    answer:
      'The calculator assumes even effort on flat ground. Real races add hills, wind, heat, a congested start, and fatigue over distance, and GPS watches drift from the measured course. Treat the splits as a plan, not a promise.',
  },
  {
    question: 'Should I pace in kilometres or miles?',
    answer:
      'Use whichever your race is marked in. Running to kilometre splits on a course marked in miles is a reliable way to lose track of where you are late in a race, when the arithmetic gets hardest.',
  },
];

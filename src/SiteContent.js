import React from 'react';
import {
  PACE_ZONES,
  POPULAR_DISTANCES_KM,
  convertPace,
  formatClock,
  formatPace,
  totalTimeFromPace,
  zoneForPace,
} from './paceMath';
import { ZONE_STYLES } from './zoneStyles';
import { ARTICLES } from './articles';

// Keep these questions in sync with the FAQPage JSON-LD in public/index.html.
// Structured data has to match what's actually on the page.
const FAQ = [
  {
    question: 'How do I convert min/km to min/mile?',
    answer:
      'Multiply by 1.609. A 5:00/km pace is 8:03/mile; to go the other way, divide by 1.609. Switching units above does this for you, and your finish time stays the same, because the distance has not changed, only the units it is described in.',
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

const REFERENCE_PACES_PER_KM = [210, 240, 270, 300, 330, 360, 390, 420, 450, 480];

// Only highlight a row when the current pace is genuinely close to it.
// Otherwise the nearest row is misleading rather than helpful.
const HIGHLIGHT_TOLERANCE_SECONDS = 15;

const nearestReferencePace = (target) => {
  if (!Number.isFinite(target)) return null;
  const nearest = REFERENCE_PACES_PER_KM.reduce((best, pace) =>
    Math.abs(pace - target) < Math.abs(best - target) ? pace : best
  );
  return Math.abs(nearest - target) <= HIGHLIGHT_TOLERANCE_SECONDS ? nearest : null;
};

const ConversionTable = ({ highlightPacePerKm }) => {
  const highlighted = nearestReferencePace(highlightPacePerKm);

  return (
    <>
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {PACE_ZONES.map((zone) => (
          <span key={zone.id} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className={`h-2 w-2 rounded-full ${ZONE_STYLES[zone.id].dot}`} />
            {zone.label}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pl-2 text-left font-medium">min/km</th>
            <th className="py-2 text-left font-medium">min/mile</th>
            {Object.keys(POPULAR_DISTANCES_KM).map((name) => (
              <th key={name} className="py-2 text-right font-medium">
                {name === 'Half Marathon' ? 'Half' : name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {REFERENCE_PACES_PER_KM.map((pacePerKm) => {
            const zone = zoneForPace(pacePerKm);
            const isCurrent = highlighted === pacePerKm;

            return (
              <tr key={pacePerKm} className={isCurrent ? 'bg-blue-50 text-slate-900' : 'text-slate-700'}>
                <td
                  className={`py-2 pl-2 font-medium tabular-nums text-slate-900 ${
                    isCurrent ? 'border-l-2 border-blue-600' : 'border-l-2 border-transparent'
                  }`}
                >
                  <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full align-middle ${
                      ZONE_STYLES[zone.id].dot
                    }`}
                  />
                  {formatPace(pacePerKm)}
                </td>
                <td className="py-2 tabular-nums">
                  {formatPace(convertPace(pacePerKm, 'km', 'mi'))}
                </td>
                {Object.values(POPULAR_DISTANCES_KM).map((km) => (
                  <td key={km} className="py-2 text-right tabular-nums">
                    {formatClock(totalTimeFromPace(pacePerKm, km))}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
};

const SiteContent = ({ highlightPacePerKm }) => (
  <div className="mt-8 space-y-4">
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">About this calculator</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Race Pace Pro works in both directions. Enter a target pace to see the finish time it
        produces, or enter a goal time to see the pace you need to hold. Pick a standard race
        distance or type your own, switch freely between kilometres and miles, and the split table
        shows the elapsed time you should see at every marker along the way.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Everything runs in your browser. Nothing is uploaded, and the link you copy carries your
        settings so you can send a pacing plan to a training partner.
      </p>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Guides</h2>
      <ul className="mt-3 divide-y divide-slate-100">
        {ARTICLES.map((article) => (
          <li key={article.slug} className="py-3 first:pt-0 last:pb-0">
            <a
              href={`/${article.slug}/`}
              className="text-sm font-medium text-blue-700 hover:underline"
            >
              {article.title}
            </a>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{article.description}</p>
          </li>
        ))}
      </ul>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Pace and finish time reference</h2>
      <p className="mt-2 text-sm text-slate-600">
        Common training paces and the race times they produce at even effort. Your current pace is
        highlighted when it lands near one of these rows.
      </p>
      <p className="mt-1 mb-4 text-xs leading-relaxed text-slate-500">
        Zones are a general guide only. Your own zones depend on current fitness and are best set
        from a recent race result or a threshold test.
      </p>
      <ConversionTable highlightPacePerKm={highlightPacePerKm} />
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">Frequently asked questions</h2>
      <dl className="mt-3 divide-y divide-slate-100">
        {FAQ.map((item) => (
          <div key={item.question} className="py-3 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium text-slate-900">{item.question}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  </div>
);

export default SiteContent;

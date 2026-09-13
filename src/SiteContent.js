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
import PaceCurve from './PaceCurve';
import TrainingStart from './TrainingStart';

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
      <h2 className="text-base font-semibold text-slate-900">When to start training</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Pick a race date and say where you are now. This works out how many weeks the build takes
        and the date you need to begin, and tells you plainly when there is not enough time.
      </p>
      <TrainingStart />
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
      <h2 className="text-base font-semibold text-slate-900">What pace drift costs you</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        The same slip in pace costs very little over 5K and a great deal over a marathon. Running
        5 seconds per kilometre slower than planned loses you 25 seconds in a 5K and about three
        and a half minutes in a marathon, which is why pacing discipline matters more the longer
        the race.
      </p>
      <PaceCurve />
    </section>
  </div>
);

export default SiteContent;

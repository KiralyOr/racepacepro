import React, { useEffect, useState } from 'react';
import {
  POPULAR_DISTANCES_KM,
  SPLIT_STRATEGIES,
  buildSplits,
  convertPace,
  formatClock,
  formatPace,
  joinTime,
  kmToUnit,
  paceFromTotalTime,
  splitPace,
  splitTime,
  totalTimeFromPace,
  unitToKm,
  zoneForPace,
} from './paceMath';
import { encodeState, initialState, persist, shareUrl } from './urlState';
import { ZONE_STYLES } from './zoneStyles';

const CUSTOM = 'custom';

const formatDistance = (value) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '');

const trimNumber = (value) => String(Math.round(value * 100) / 100);

const Segmented = ({ label, options, value, onChange }) => (
  <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-xl bg-slate-100 p-1">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="radio"
        aria-checked={value === option.value}
        onClick={() => onChange(option.value)}
        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
          value === option.value
            ? 'bg-white text-blue-700 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

// Full 0-59 for minutes rather than a realistic running range: converting a
// slow pace to miles can push it higher than expected, and a value outside the
// option list would leave the select showing nothing.
const MINUTES = range(0, 59);
const SECONDS = range(0, 59);
const HOURS = range(0, 23);

// A native select is deliberate: iOS renders it as a scroll wheel, which is
// far easier than typing on a phone, while desktop gets a normal dropdown.
const TimeSelect = ({ label, value, options, onChange, pad }) => (
  <label className="flex flex-1 flex-col gap-1">
    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={label}
      className="w-full appearance-none rounded-lg border border-slate-200 bg-white bg-[length:1rem] bg-[right_0.6rem_center] bg-no-repeat py-2 pl-3 pr-8 text-lg tabular-nums text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")",
      }}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {pad ? String(option).padStart(2, '0') : option}
        </option>
      ))}
    </select>
  </label>
);

const PaceCalculator = ({ onPacePerKmChange }) => {
  const [state, setState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const { selectedKey, customValue, customKm, unit, mode, paceSeconds, totalSeconds, strategy } =
    state;

  const patch = (fields) => setState((current) => ({ ...current, ...fields }));

  const isCustom = selectedKey === CUSTOM;
  const distanceInUnit = isCustom
    ? parseFloat(customValue) || 0
    : kmToUnit(POPULAR_DISTANCES_KM[selectedKey], unit);
  const unitLabel = unit === 'km' ? 'km' : 'mi';

  useEffect(() => {
    if (mode === 'timeFromPace') {
      patch({ totalSeconds: totalTimeFromPace(paceSeconds, distanceInUnit) });
    }
  }, [mode, paceSeconds, distanceInUnit]);

  useEffect(() => {
    if (mode === 'paceFromTime') {
      patch({ paceSeconds: paceFromTotalTime(totalSeconds, distanceInUnit) });
    }
  }, [mode, totalSeconds, distanceInUnit]);

  useEffect(() => {
    persist(encodeState(state));
  }, [state]);

  // The reference table below the calculator highlights the row nearest the
  // current pace, so it needs the value normalised to seconds per kilometre.
  useEffect(() => {
    if (!onPacePerKmChange) return;
    onPacePerKmChange(unit === 'mi' ? convertPace(paceSeconds, 'mi', 'km') : paceSeconds);
  }, [paceSeconds, unit, onPacePerKmChange]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const changeUnit = (nextUnit) => {
    if (nextUnit === unit) return;
    patch({
      unit: nextUnit,
      paceSeconds: convertPace(paceSeconds, unit, nextUnit),
      // Converted from the canonical kilometres, not from the rounded field, so
      // switching back and forth returns the number originally typed.
      customValue: trimNumber(kmToUnit(customKm, nextUnit)),
    });
  };

  const changeCustomDistance = (text) =>
    patch({ customValue: text, customKm: unitToKm(parseFloat(text) || 0, unit) });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl(encodeState(state)));
      setCopied(true);
    } catch {
      // Clipboard unavailable (insecure context or denied) — the URL bar still has it.
    }
  };

  const pace = splitPace(paceSeconds);
  const time = splitTime(totalSeconds);
  const fraction = SPLIT_STRATEGIES.find((s) => s.id === strategy)?.fraction ?? 0;
  const splits = buildSplits(distanceInUnit, totalSeconds, fraction);
  const showingTime = mode === 'timeFromPace';
  const zone = zoneForPace(paceSeconds, unit);
  const halfway = distanceInUnit / 2;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <Segmented
          label="Calculation direction"
          value={mode}
          onChange={(value) => patch({ mode: value })}
          options={[
            { value: 'timeFromPace', label: 'Pace → Time' },
            { value: 'paceFromTime', label: 'Time → Pace' },
          ]}
        />

        <div className="mt-6">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Distance
          </div>
          <div role="radiogroup" aria-label="Distance" className="flex flex-wrap gap-2">
            {Object.keys(POPULAR_DISTANCES_KM).map((key) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selectedKey === key}
                onClick={() => patch({ selectedKey: key })}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selectedKey === key
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {key}
              </button>
            ))}
            <button
              type="button"
              role="radio"
              aria-checked={isCustom}
              onClick={() => patch({ selectedKey: CUSTOM })}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isCustom
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              Custom
            </button>
          </div>

          {isCustom ? (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min="0.1"
                step="0.1"
                value={customValue}
                onChange={(e) => changeCustomDistance(e.target.value)}
                aria-label="Custom distance"
                className="w-32 rounded-lg border border-slate-200 px-3 py-2 tabular-nums outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-sm text-slate-500">{unitLabel}</span>
            </div>
          ) : (
            <div className="mt-2 text-sm text-slate-500">
              {formatDistance(Math.round(distanceInUnit * 100) / 100)} {unitLabel}
            </div>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Units
            </div>
            <Segmented
              label="Units"
              value={unit}
              onChange={changeUnit}
              options={[
                { value: 'km', label: 'Kilometres' },
                { value: 'mi', label: 'Miles' },
              ]}
            />
          </div>

          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              {showingTime ? `Target pace (per ${unitLabel})` : 'Goal time'}
            </div>
            {showingTime ? (
              <div className="flex gap-2">
                <TimeSelect
                  label="min"
                  options={MINUTES}
                  value={pace.minutes}
                  onChange={(value) => patch({ paceSeconds: value * 60 + pace.seconds })}
                />
                <TimeSelect
                  label="sec"
                  options={SECONDS}
                  pad
                  value={pace.seconds}
                  onChange={(value) => patch({ paceSeconds: pace.minutes * 60 + value })}
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <TimeSelect
                  label="hr"
                  options={HOURS}
                  value={time.hours}
                  onChange={(value) => patch({ totalSeconds: joinTime({ ...time, hours: value }) })}
                />
                <TimeSelect
                  label="min"
                  options={MINUTES}
                  pad
                  value={time.minutes}
                  onChange={(value) =>
                    patch({ totalSeconds: joinTime({ ...time, minutes: value }) })
                  }
                />
                <TimeSelect
                  label="sec"
                  options={SECONDS}
                  pad
                  value={time.seconds}
                  onChange={(value) =>
                    patch({ totalSeconds: joinTime({ ...time, seconds: value }) })
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-900 px-5 py-6 text-center text-white">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {showingTime ? 'Finish time' : `Required pace (per ${unitLabel})`}
          </div>
          <div className="mt-1 text-4xl font-semibold tabular-nums sm:text-5xl">
            {showingTime ? formatClock(totalSeconds) : formatPace(paceSeconds)}
          </div>
          <div className="mt-2 text-sm text-slate-400">
            {showingTime
              ? `${formatPace(paceSeconds)} per ${unitLabel} · ${formatDistance(
                  Math.round(distanceInUnit * 100) / 100
                )} ${unitLabel}`
              : `${formatClock(totalSeconds)} over ${formatDistance(
                  Math.round(distanceInUnit * 100) / 100
                )} ${unitLabel}`}
          </div>
          {zone && (
            <div className="mt-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  ZONE_STYLES[zone.id].pill
                }`}
              >
                {zone.label} pace
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="mt-3 w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          {copied ? 'Link copied' : 'Copy shareable link'}
        </button>
      </section>

      {splits.length > 1 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">Split times</h2>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span>Strategy</span>
              <select
                value={strategy}
                onChange={(e) => patch({ strategy: e.target.value })}
                aria-label="Split strategy"
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
              >
                {SPLIT_STRATEGIES.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-3 max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2 text-left font-medium">Distance</th>
                  <th className="pb-2 text-right font-medium">Elapsed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {splits.map((split, index) => {
                  const crossesHalfway =
                    fraction > 0 &&
                    split.distance > halfway &&
                    (index === 0 || splits[index - 1].distance <= halfway);

                  return (
                    <React.Fragment key={split.distance}>
                      {crossesHalfway && (
                        <tr>
                          <td colSpan={2} className="pt-2 pb-1">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                              <span className="h-px flex-1 bg-emerald-200" />
                              Halfway · second half {Math.round(fraction * 100)}% quicker
                              <span className="h-px flex-1 bg-emerald-200" />
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr
                        className={
                          split.isFinish ? 'font-semibold text-blue-700' : 'text-slate-700'
                        }
                      >
                        <td className="py-2 tabular-nums">
                          {formatDistance(split.distance)} {unitLabel}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {formatClock(split.seconds)}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default PaceCalculator;

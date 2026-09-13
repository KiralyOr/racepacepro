import React, { useEffect, useState } from 'react';
import {
  POPULAR_DISTANCES_KM,
  clampNegativeSplitPct,
  buildSplits,
  convertPace,
  formatClock,
  formatPace,
  joinTime,
  kmToUnit,
  paceFromTotalTime,
  splitPace,
  negativeSplitOptions,
  splitTime,
  totalTimeFromPace,
  unitToKm,
  zoneForPace,
} from './paceMath';
import { encodeState, initialState, persist, shareUrl } from './urlState';
import { ZONE_STYLES } from './zoneStyles';
import { HOURS, MINUTES, SECONDS, TimeSelect } from './formControls';

const CUSTOM = 'custom';

const formatDistance = (value) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, '');

const trimNumber = (value) => String(Math.round(value * 100) / 100);

const Icon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="h-4 w-4"
  >
    {children}
  </svg>
);

const LinkIcon = () => (
  <Icon>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </Icon>
);

const CheckIcon = () => (
  <Icon>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

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

const PaceCalculator = ({ onPacePerKmChange }) => {
  const [state, setState] = useState(initialState);
  const [copied, setCopied] = useState(false);
  const { selectedKey, customValue, customKm, unit, mode, paceSeconds, totalSeconds, negativeSplitPct } =
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
      // Clipboard unavailable (insecure context or denied). The URL bar still has it.
    }
  };

  const pace = splitPace(paceSeconds);
  const time = splitTime(totalSeconds);
  const fraction = negativeSplitPct / 100;
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

        <div className="relative mt-6 rounded-xl bg-slate-900 px-5 py-6 text-center text-white">
          <button
            type="button"
            onClick={copyLink}
            aria-label={copied ? 'Link copied' : 'Copy shareable link'}
            title={copied ? 'Link copied' : 'Copy shareable link'}
            className={`absolute right-2 top-2 rounded-lg p-2 transition hover:bg-white/10 ${
              copied ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            {copied ? <CheckIcon /> : <LinkIcon />}
          </button>
          <span role="status" className="sr-only">
            {copied ? 'Link copied to clipboard' : ''}
          </span>

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

      </section>

      {splits.length > 1 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">Split times</h2>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span>Strategy</span>
              <select
                value={negativeSplitPct}
                onChange={(e) => patch({ negativeSplitPct: clampNegativeSplitPct(e.target.value) })}
                aria-label="Split strategy"
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
              >
                {negativeSplitOptions().map((pct) => (
                  <option key={pct} value={pct}>
                    {pct === 0 ? 'Even' : `${pct}% negative`}
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
                              Halfway · second half {negativeSplitPct}% quicker
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

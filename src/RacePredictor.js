import React, { useState } from 'react';
import {
  POPULAR_DISTANCES_KM,
  RIEGEL_EXPONENTS,
  formatClock,
  formatPace,
  joinTime,
  predictAll,
  splitTime,
} from './paceMath';
import { HOURS, MINUTES, SECONDS, TimeSelect, Field, selectClass } from './formControls';

const DEFAULT_DISTANCE = '10K';
const DEFAULT_SECONDS = 50 * 60;

const RacePredictor = () => {
  const [distance, setDistance] = useState(DEFAULT_DISTANCE);
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS);
  const [exponentId, setExponentId] = useState('standard');

  const time = splitTime(seconds);
  const exponent = RIEGEL_EXPONENTS.find((e) => e.id === exponentId);
  const rows = predictAll(seconds, POPULAR_DISTANCES_KM[distance], exponent.value);

  return (
    <div className="mt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Distance you raced">
          <select
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className={selectClass}
          >
            {Object.keys(POPULAR_DISTANCES_KM).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Training assumption">
          <select
            value={exponentId}
            onChange={(e) => setExponentId(e.target.value)}
            className={selectClass}
          >
            {RIEGEL_EXPONENTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-3">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Time you ran
        </span>
        <div className="mt-1 flex gap-2">
          <TimeSelect
            label="Hours"
            options={HOURS}
            value={time.hours}
            onChange={(value) => setSeconds(joinTime({ ...time, hours: value }))}
          />
          <TimeSelect
            label="Minutes"
            options={MINUTES}
            pad
            value={time.minutes}
            onChange={(value) => setSeconds(joinTime({ ...time, minutes: value }))}
          />
          <TimeSelect
            label="Seconds"
            options={SECONDS}
            pad
            value={time.seconds}
            onChange={(value) => setSeconds(joinTime({ ...time, seconds: value }))}
          />
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">{exponent.note}</p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 pl-2 text-left font-medium">Distance</th>
              <th className="py-2 text-right font-medium">Predicted</th>
              <th className="py-2 pr-2 text-right font-medium">Pace per km</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.name}
                className={row.isSource ? 'bg-blue-50 text-slate-900' : 'text-slate-700'}
              >
                <td
                  className={`py-2 pl-2 font-medium text-slate-900 ${
                    row.isSource ? 'border-l-2 border-blue-600' : 'border-l-2 border-transparent'
                  }`}
                >
                  {row.name}
                  {row.isSource && (
                    <span className="ml-2 text-xs font-normal text-slate-500">your result</span>
                  )}
                </td>
                <td className="py-2 text-right tabular-nums">
                  {formatClock(Math.round(row.seconds))}
                </td>
                <td className="py-2 pr-2 text-right tabular-nums">
                  {formatPace(row.pacePerKm)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        Predictions assume you are equally well trained for every distance, which almost nobody is.
        They are most reliable close to the distance you actually raced, and least reliable
        predicting a marathon from a 5K. Treat the marathon row as an upper bound on what is
        possible rather than a target, unless you have done the long runs to support it.
      </p>
    </div>
  );
};

export default RacePredictor;

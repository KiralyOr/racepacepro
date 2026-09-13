import React from 'react';

// Shared form controls. These were duplicated across the calculator and the
// training planner; the predictor would have been a third copy.

export const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

// Full 0-59 for minutes rather than a realistic running range: converting a
// slow pace to miles can push it higher than expected, and a value outside the
// option list would leave the select showing nothing.
export const MINUTES = range(0, 59);
export const SECONDS = range(0, 59);
export const HOURS = range(0, 23);

export const selectClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1">
    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
    {children}
  </label>
);

// A native select is deliberate: iOS renders it as a scroll wheel, which is
// far easier than typing on a phone, while desktop gets a normal dropdown.
export const TimeSelect = ({ label, value, options, onChange, pad }) => (
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

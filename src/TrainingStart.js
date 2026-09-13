import React, { useState } from 'react';
import { GOALS, LEVELS, addWeeks, fallbackGoal, formatDate, planFor } from './trainingPlan';

// Parsed and formatted by hand rather than through Date's string parsing:
// new Date('2026-12-06') is treated as UTC midnight, which lands on the
// previous day for anyone west of Greenwich.
const toInputValue = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

const parseInputValue = (value) => {
  const [year, month, day] = (value || '').split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const Field = ({ label, children }) => (
  <label className="flex flex-col gap-1">
    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
    {children}
  </label>
);

const selectClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const VERDICT = {
  comfortable: {
    tone: 'bg-emerald-50 text-emerald-800',
    title: 'There is time for this',
  },
  tight: {
    tone: 'bg-amber-50 text-amber-800',
    title: 'Tight but possible',
  },
  short: {
    tone: 'bg-red-50 text-red-800',
    title: 'Not enough runway',
  },
  past: {
    tone: 'bg-slate-100 text-slate-700',
    title: 'That date has passed',
  },
};

const TrainingStart = () => {
  const today = startOfToday();
  const [level, setLevel] = useState('casual');
  const [goal, setGoal] = useState('marathon');
  const [ambitious, setAmbitious] = useState(false);
  // Far enough out that the default selections open on a workable plan rather
  // than greeting everyone with "not enough runway".
  const [raceDate, setRaceDate] = useState(() => toInputValue(addWeeks(startOfToday(), 36)));

  const parsed = parseInputValue(raceDate);
  const plan = parsed ? planFor({ today, raceDate: parsed, level, goal, ambitious }) : null;
  const goalLabel = GOALS.find((g) => g.id === goal)?.label.toLowerCase();
  const easier = plan && plan.verdict === 'short' ? fallbackGoal(goal) : null;
  const easierLabel = easier && GOALS.find((g) => g.id === easier)?.label.toLowerCase();

  return (
    <div className="mt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Where you are now">
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass}>
            {LEVELS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Race you want to run">
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className={selectClass}>
            {GOALS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Race date">
          <input
            type="date"
            value={raceDate}
            onChange={(e) => setRaceDate(e.target.value)}
            className={selectClass}
          />
        </Field>

        <label className="flex items-end gap-2 pb-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={ambitious}
            onChange={(e) => setAmbitious(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          <span>I have a time target, not just finishing</span>
        </label>
      </div>

      {plan && (
        <div className="mt-5 rounded-xl bg-slate-900 px-5 py-6 text-center text-white">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Start training by
          </div>
          <div className="mt-1 text-3xl font-semibold sm:text-4xl">
            {/* Behind schedule means the ideal start date is already past, so
                the useful headline is the instruction, not the date. */}
            {plan.verdict === 'past' && 'Pick a future date'}
            {plan.verdict === 'comfortable' && formatDate(plan.startBy)}
            {(plan.verdict === 'tight' || plan.verdict === 'short') && 'Start now'}
          </div>
          <div className="mt-2 text-sm text-slate-400">
            {plan.needed} weeks of training for a {goalLabel} from where you are
            {plan.verdict !== 'past' && `, and you have ${Math.max(0, plan.available)}`}
          </div>
          <div className="mt-3">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                VERDICT[plan.verdict].tone
              }`}
            >
              {VERDICT[plan.verdict].title}
            </span>
          </div>
        </div>
      )}

      {plan && plan.verdict === 'tight' && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          You are about {plan.shortfall} {plan.shortfall === 1 ? 'week' : 'weeks'} short of a
          comfortable build. That is recoverable if you are already running consistently, but it
          leaves no room for illness or a missed fortnight. Start now rather than next month.
        </p>
      )}

      {plan && plan.verdict === 'short' && (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          You are {plan.shortfall} weeks short, which is the point where compressing the plan starts
          causing injuries rather than fitness.
          {easierLabel
            ? ` Two better options: target a ${easierLabel} at this race and save the ${goalLabel} for a later one, or keep the ${goalLabel} and pick a race about ${plan.shortfall} weeks further out.`
            : ' Pick a later race.'}
        </p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-slate-500">
        These are conventional plan lengths, not a personalised prescription. They assume you stay
        healthy and train consistently, and they are deliberately conservative for anyone stepping
        up a distance for the first time.
      </p>
    </div>
  );
};

export default TrainingStart;

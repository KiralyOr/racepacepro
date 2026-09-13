import React, { useState } from 'react';
import PaceCalculator from './PaceCalculator';
import SiteContent from './SiteContent';
import './index.css';

const Logo = () => (
  <svg viewBox="0 0 512 512" aria-hidden="true" className="h-7 w-7">
    <rect width="512" height="512" rx="112" fill="#2563eb" />
    <rect x="234" y="116" width="44" height="52" rx="12" fill="#fff" />
    <circle cx="256" cy="302" r="132" fill="none" stroke="#fff" strokeWidth="40" />
    <path d="M256 302 L330 228" fill="none" stroke="#fff" strokeWidth="36" strokeLinecap="round" />
  </svg>
);

const App = () => {
  // Lifted so the reference table can highlight the row nearest the current pace.
  const [pacePerKm, setPacePerKm] = useState(null);

  return (
  <div className="min-h-screen bg-slate-50">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-2xl items-center gap-2.5 px-4 py-4">
        <Logo />
        <span className="text-lg font-semibold tracking-tight text-slate-900">Race Pace Pro</span>
      </div>
    </header>

    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Running Pace Calculator
      </h1>
      <p className="mt-2 mb-6 text-sm leading-relaxed text-slate-600">
        Work out your finish time from a target pace, or the pace you need to hit a goal time — for
        5K, 10K, half marathon, marathon or any distance you choose, in kilometres or miles.
      </p>

      <PaceCalculator onPacePerKmChange={setPacePerKm} />
      <SiteContent highlightPacePerKm={pacePerKm} />
    </main>

    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6 text-sm text-slate-500">
        Race Pace Pro — a free running pace calculator. Calculations run entirely in your browser.
      </div>
    </footer>
  </div>
  );
};

export default App;

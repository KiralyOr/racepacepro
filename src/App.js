import React, { useState } from 'react';
import PaceCalculator from './PaceCalculator';
import SiteContent from './SiteContent';
import './index.css';

// The page chrome, the heading and the content below the tools live in
// public/index.html and are written by scripts/generate-pages.js, so a crawler
// sees them without executing anything. React only mounts the interactive
// parts, into #root between the intro and that content.
const App = () => {
  // Lifted so the reference table can highlight the row nearest the current pace.
  const [pacePerKm, setPacePerKm] = useState(null);

  return (
    <>
      <PaceCalculator onPacePerKmChange={setPacePerKm} />
      <SiteContent highlightPacePerKm={pacePerKm} />
    </>
  );
};

export default App;

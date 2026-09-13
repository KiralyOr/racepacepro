import React, { useState, useEffect } from 'react';
import {
  POPULAR_DISTANCES_KM,
  convertPace,
  joinTime,
  kmToUnit,
  paceFromTotalTime,
  splitPace,
  splitTime,
  totalTimeFromPace,
  unitToKm,
} from './paceMath';

const CUSTOM = 'custom';

const NumberField = ({ label, value, onChange, max, disabled }) => (
  <label className="flex items-center space-x-2">
    <input
      type="number"
      min="0"
      max={max}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
      className={`border rounded px-2 py-1 w-20 ${disabled ? 'bg-gray-100' : ''}`}
      aria-label={label}
    />
    <span className="self-center">{label}</span>
  </label>
);

const PaceCalculator = () => {
  const [mode, setMode] = useState('timeFromPace');
  const [unit, setUnit] = useState('km');
  const [selectedKey, setSelectedKey] = useState('5K');
  const [customValue, setCustomValue] = useState('5');
  const [paceSeconds, setPaceSeconds] = useState(300);
  const [totalSeconds, setTotalSeconds] = useState(1500);

  const isCustom = selectedKey === CUSTOM;
  const distanceInUnit = isCustom
    ? parseFloat(customValue) || 0
    : kmToUnit(POPULAR_DISTANCES_KM[selectedKey], unit);

  useEffect(() => {
    if (mode === 'timeFromPace') {
      setTotalSeconds(totalTimeFromPace(paceSeconds, distanceInUnit));
    }
  }, [mode, paceSeconds, distanceInUnit]);

  useEffect(() => {
    if (mode === 'paceFromTime') {
      setPaceSeconds(paceFromTotalTime(totalSeconds, distanceInUnit));
    }
  }, [mode, totalSeconds, distanceInUnit]);

  const handleUnitChange = (nextUnit) => {
    if (nextUnit === unit) return;
    if (isCustom) {
      const km = unitToKm(parseFloat(customValue) || 0, unit);
      setCustomValue(String(Math.round(kmToUnit(km, nextUnit) * 100) / 100));
    }
    setPaceSeconds((previous) => convertPace(previous, unit, nextUnit));
    setUnit(nextUnit);
  };

  const pace = splitPace(paceSeconds);
  const time = splitTime(totalSeconds);
  const unitLabel = unit === 'km' ? 'km' : 'mi';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Running Pace Calculator</h1>

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${
              mode === 'timeFromPace' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-l-lg font-medium`}
            onClick={() => setMode('timeFromPace')}
          >
            Pace → Time
          </button>
          <button
            className={`flex-1 py-2 ${
              mode === 'paceFromTime' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            } rounded-r-lg font-medium`}
            onClick={() => setMode('paceFromTime')}
          >
            Time → Pace
          </button>
        </div>

        <div className="mb-6">
          <div className="font-semibold mb-2">Distance</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {Object.keys(POPULAR_DISTANCES_KM).map((key) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="distance"
                  checked={selectedKey === key}
                  onChange={() => setSelectedKey(key)}                />
                <span>{key}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="distance"
                checked={isCustom}
                onChange={() => setSelectedKey(CUSTOM)}
                className="form-radio"
              />
              <span>Custom</span>
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={customValue}
              disabled={!isCustom}
              onChange={(e) => setCustomValue(e.target.value)}
              className={`border rounded px-2 py-1 w-24 ${isCustom ? '' : 'bg-gray-100'}`}
              aria-label="Custom distance"
            />
            <span>{unitLabel}</span>
          </div>
          {!isCustom && (
            <div className="text-sm text-gray-500 mt-2">
              {distanceInUnit.toFixed(2)} {unitLabel}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="font-semibold mb-2">Unit</div>
          <div className="flex space-x-4">
            {[
              ['km', 'Kilometers'],
              ['mi', 'Miles'],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="unit"
                  checked={unit === value}
                  onChange={() => handleUnitChange(value)}                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="font-semibold mb-2">Pace (per {unitLabel})</div>
          {mode === 'timeFromPace' ? (
            <div className="flex space-x-2">
              <NumberField
                label="min"
                value={pace.minutes}
                onChange={(value) => setPaceSeconds(value * 60 + pace.seconds)}
              />
              <NumberField
                label="sec"
                max="59"
                value={pace.seconds}
                onChange={(value) => setPaceSeconds(pace.minutes * 60 + Math.min(59, value))}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded">
              <span>{String(pace.minutes).padStart(2, '0')}m</span>
              <span>{String(pace.seconds).padStart(2, '0')}s</span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="font-semibold mb-2">Total Time</div>
          {mode === 'paceFromTime' ? (
            <div className="flex space-x-2">
              <NumberField
                label="h"
                value={time.hours}
                onChange={(value) => setTotalSeconds(joinTime({ ...time, hours: value }))}
              />
              <NumberField
                label="m"
                max="59"
                value={time.minutes}
                onChange={(value) =>
                  setTotalSeconds(joinTime({ ...time, minutes: Math.min(59, value) }))
                }
              />
              <NumberField
                label="s"
                max="59"
                value={time.seconds}
                onChange={(value) =>
                  setTotalSeconds(joinTime({ ...time, seconds: Math.min(59, value) }))
                }
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded">
              <span>{String(time.hours).padStart(2, '0')}h</span>
              <span>{String(time.minutes).padStart(2, '0')}m</span>
              <span>{String(time.seconds).padStart(2, '0')}s</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaceCalculator;

import React, { useState, useEffect } from 'react';

const PaceCalculator = () => {
  // State variables
  const [distance, setDistance] = useState(5);
  const [customDistance, setCustomDistance] = useState(5);
  const [isCustomDistance, setIsCustomDistance] = useState(false);
  const [unit, setUnit] = useState('km');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [paceMinutes, setPaceMinutes] = useState(5);
  const [paceSeconds, setPaceSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState('timeFromPace');

  // Popular distances in km
  const popularDistances = {
    '5k': 5,
    '10k': 10,
    'Half Marathon': 21.0975,
    'Marathon': 42.195
  };

  // Conversion factors
  const kmToMiles = 0.621371;
  const milesToKm = 1.60934;

  // Calculate total time from pace
  const calculateTimeFromPace = () => {
    const paceInSeconds = (paceMinutes * 60) + paceSeconds;
    let dist = isCustomDistance ? customDistance : distance;
    
    // Total time in seconds
    const totalTimeInSeconds = paceInSeconds * dist;
    
    // Convert to hours, minutes, seconds
    const hrs = Math.floor(totalTimeInSeconds / 3600);
    const mins = Math.floor((totalTimeInSeconds % 3600) / 60);
    const secs = Math.floor(totalTimeInSeconds % 60);
    
    setHours(hrs);
    setMinutes(mins);
    setSeconds(secs);
  };

  // Calculate pace from time
  const calculatePaceFromTime = () => {
    const totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;
    let dist = isCustomDistance ? customDistance : distance;
    
    // Pace in seconds
    const paceInSeconds = totalTimeInSeconds / dist;
    
    // Convert to minutes and seconds
    const mins = Math.floor(paceInSeconds / 60);
    const secs = Math.floor(paceInSeconds % 60);
    
    setPaceMinutes(mins);
    setPaceSeconds(secs);
  };

  // Handle distance change
  const handleDistanceChange = (e) => {
    const value = e.target.value;
    setDistance(popularDistances[value]);
    setIsCustomDistance(false);
    if (activeTab === 'timeFromPace') {
      calculateTimeFromPace();
    } else {
      calculatePaceFromTime();
    }
  };

  // Handle custom distance change
  const handleCustomDistanceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setCustomDistance(value);
    setIsCustomDistance(true);
    if (activeTab === 'timeFromPace') {
      calculateTimeFromPace();
    } else {
      calculatePaceFromTime();
    }
  };

  // Handle unit change
  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    if (newUnit !== unit) {
      if (newUnit === 'miles') {
        // Convert from km to miles
        if (!isCustomDistance) {
          setDistance(distance * kmToMiles);
        } else {
          setCustomDistance(customDistance * kmToMiles);
        }
      } else {
        // Convert from miles to km
        if (!isCustomDistance) {
          setDistance(distance * milesToKm);
        } else {
          setCustomDistance(customDistance * milesToKm);
        }
      }
      setUnit(newUnit);
    }
  };

  // Effect to recalculate when dependencies change
  useEffect(() => {
    if (activeTab === 'timeFromPace') {
      calculateTimeFromPace();
    } else {
      calculatePaceFromTime();
    }
  }, [paceMinutes, paceSeconds, activeTab, isCustomDistance, customDistance, distance, unit]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Running Pace Calculator</h1>
        
        {/* Tab selector */}
        <div className="flex mb-6">
          <button 
            className={`flex-1 py-2 ${activeTab === 'timeFromPace' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-l-lg font-medium`}
            onClick={() => setActiveTab('timeFromPace')}
          >
            Pace → Time
          </button>
          <button 
            className={`flex-1 py-2 ${activeTab === 'paceFromTime' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-r-lg font-medium`}
            onClick={() => setActiveTab('paceFromTime')}
          >
            Time → Pace
          </button>
        </div>
        
        {/* Distance selection */}
        <div className="mb-6">
          <div className="font-semibold mb-2">Distance</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {Object.keys(popularDistances).map((key) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="distance"
                  value={key}
                  checked={!isCustomDistance && distance === popularDistances[key]}
                  onChange={handleDistanceChange}
                  className="form-radio"
                />
                <span>{key}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="distance"
                checked={isCustomDistance}
                onChange={() => setIsCustomDistance(true)}
                className="form-radio"
              />
              <span>Custom</span>
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={customDistance}
              onChange={handleCustomDistanceChange}
              className={`border rounded px-2 py-1 w-20 ${!isCustomDistance ? 'bg-gray-100' : ''}`}
              disabled={!isCustomDistance}
            />
            <span>{unit}</span>
          </div>
        </div>
        
        {/* Unit toggle */}
        <div className="mb-6">
          <div className="font-semibold mb-2">Unit</div>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="unit"
                value="km"
                checked={unit === 'km'}
                onChange={handleUnitChange}
                className="form-radio"
              />
              <span>Kilometers</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="unit"
                value="miles"
                checked={unit === 'miles'}
                onChange={handleUnitChange}
                className="form-radio"
              />
              <span>Miles</span>
            </label>
          </div>
        </div>
        
        {activeTab === 'timeFromPace' ? (
          <>
            {/* Pace input */}
            <div className="mb-6">
              <div className="font-semibold mb-2">Pace (per {unit})</div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  value={paceMinutes}
                  onChange={(e) => setPaceMinutes(parseInt(e.target.value) || 0)}
                  className="border rounded px-2 py-1 w-20"
                />
                <span className="self-center">min</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={paceSeconds}
                  onChange={(e) => setPaceSeconds(parseInt(e.target.value) || 0)}
                  className="border rounded px-2 py-1 w-20"
                />
                <span className="self-center">sec</span>
              </div>
            </div>
            
            {/* Total time output */}
            <div className="mb-6">
              <div className="font-semibold mb-2">Total Time</div>
              <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded">
                <span>{hours.toString().padStart(2, '0')}h</span>
                <span>{minutes.toString().padStart(2, '0')}m</span>
                <span>{seconds.toString().padStart(2, '0')}s</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Time input */}
            <div className="mb-6">
              <div className="font-semibold mb-2">Total Time</div>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="border rounded px-2 py-1 w-20"
                />
                <span className="self-center">h</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="border rounded px-2 py-1 w-20"
                />
                <span className="self-center">m</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  className="border rounded px-2 py-1 w-20"
                />
                <span className="self-center">s</span>
              </div>
            </div>
            
            {/* Pace output */}
            <div className="mb-6">
              <div className="font-semibold mb-2">Pace (per {unit})</div>
              <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded">
                <span>{paceMinutes.toString().padStart(2, '0')}m</span>
                <span>{paceSeconds.toString().padStart(2, '0')}s</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaceCalculator;
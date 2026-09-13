import React, { useState } from 'react';
import { POPULAR_DISTANCES_KM, formatClock, formatPace, totalTimeFromPace } from './paceMath';

// Categorical slots 1 to 4 of the validated default palette, in fixed order.
// Assigned longest distance first: the marathon line is the one the chart is
// about, and the flattest line can afford the palest hue. The mapping is fixed,
// so a series never changes colour.
const SERIES = [
  { name: 'Marathon', km: POPULAR_DISTANCES_KM.Marathon, color: '#2a78d6' },
  { name: 'Half', km: POPULAR_DISTANCES_KM['Half Marathon'], color: '#eb6834' },
  { name: '10K', km: POPULAR_DISTANCES_KM['10K'], color: '#1baf7a' },
  { name: '5K', km: POPULAR_DISTANCES_KM['5K'], color: '#eda100' },
];

const PACE_MIN = 180;
const PACE_MAX = 480;
const Y_MAX = 6 * 3600;

const W = 640;
const H = 380;
const PAD = { top: 16, right: 92, bottom: 36, left: 54 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

const xOf = (paceSeconds) => PAD.left + ((paceSeconds - PACE_MIN) / (PACE_MAX - PACE_MIN)) * PLOT_W;
const yOf = (seconds) => PAD.top + (1 - seconds / Y_MAX) * PLOT_H;

const X_TICKS = [180, 240, 300, 360, 420, 480];
const Y_TICKS = [0, 3600, 7200, 10800, 14400, 18000, 21600];

const PaceCurve = () => {
  const [hoverPace, setHoverPace] = useState(null);

  const track = (event) => {
    const box = event.currentTarget.getBoundingClientRect();
    const point = event.touches ? event.touches[0] : event;
    // Container width maps to the whole viewBox, so convert to viewBox units
    // first, then out of the plot area into a pace.
    const viewBoxX = ((point.clientX - box.left) / box.width) * W;
    const ratio = (viewBoxX - PAD.left) / PLOT_W;
    const paceSeconds = PACE_MIN + ratio * (PACE_MAX - PACE_MIN);
    setHoverPace(Math.min(PACE_MAX, Math.max(PACE_MIN, Math.round(paceSeconds))));
  };

  return (
    <div className="mt-4">
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {SERIES.map((series) => (
          <span key={series.name} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span
              className="inline-block h-0.5 w-4 rounded-full"
              style={{ backgroundColor: series.color }}
            />
            {series.name}
          </span>
        ))}
      </div>

      <div
        className="relative touch-pan-y"
        onMouseMove={track}
        onMouseLeave={() => setHoverPace(null)}
        onTouchStart={track}
        onTouchMove={track}
        onTouchEnd={() => setHoverPace(null)}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Finish time against pace for four race distances. The marathon line is far steeper than the 5K line, so the same drift in pace costs much more over a longer race."
        >
          {Y_TICKS.map((seconds) => (
            <g key={seconds}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={yOf(seconds)}
                y2={yOf(seconds)}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 8}
                y={yOf(seconds) + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
              >
                {seconds / 3600}h
              </text>
            </g>
          ))}

          {X_TICKS.map((paceSeconds) => (
            <text
              key={paceSeconds}
              x={xOf(paceSeconds)}
              y={H - 12}
              textAnchor="middle"
              fontSize="11"
              fill="#64748b"
            >
              {formatPace(paceSeconds)}
            </text>
          ))}
          <text
            x={PAD.left + PLOT_W / 2}
            y={H - 1}
            textAnchor="middle"
            fontSize="11"
            fill="#94a3b8"
          >
            pace per kilometre
          </text>

          {SERIES.map((series) => {
            const start = totalTimeFromPace(PACE_MIN, series.km);
            const end = totalTimeFromPace(PACE_MAX, series.km);
            return (
              <g key={series.name}>
                <line
                  x1={xOf(PACE_MIN)}
                  y1={yOf(start)}
                  x2={xOf(PACE_MAX)}
                  y2={yOf(end)}
                  stroke={series.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx={xOf(PACE_MAX)} cy={yOf(end)} r="4" fill={series.color} />
                <text
                  x={xOf(PACE_MAX) + 10}
                  y={yOf(end) + 4}
                  fontSize="12"
                  fill="#334155"
                  fontWeight="600"
                >
                  {series.name}
                </text>
              </g>
            );
          })}

          {hoverPace !== null && (
            <g>
              <line
                x1={xOf(hoverPace)}
                x2={xOf(hoverPace)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="#94a3b8"
                strokeWidth="1"
              />
              {SERIES.map((series) => (
                <circle
                  key={series.name}
                  cx={xOf(hoverPace)}
                  cy={yOf(totalTimeFromPace(hoverPace, series.km))}
                  r="4.5"
                  fill={series.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              ))}
            </g>
          )}
        </svg>

        {hoverPace !== null && (
          <div
            className="pointer-events-none absolute top-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-md"
            style={{
              left: `${(xOf(hoverPace) / W) * 100}%`,
              transform:
                xOf(hoverPace) > W / 2 ? 'translateX(calc(-100% - 10px))' : 'translateX(10px)',
            }}
          >
            <div className="mb-1 font-semibold tabular-nums text-slate-900">
              {formatPace(hoverPace)} per km
            </div>
            {SERIES.map((series) => (
              <div key={series.name} className="flex items-center gap-2 text-slate-600">
                <span
                  className="inline-block h-0.5 w-3 rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                <span className="w-16">{series.name}</span>
                <span className="tabular-nums text-slate-900">
                  {formatClock(totalTimeFromPace(hoverPace, series.km))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaceCurve;

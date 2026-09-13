import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaceCurve from './PaceCurve';
import { POPULAR_DISTANCES_KM, totalTimeFromPace } from './paceMath';

describe('PaceCurve', () => {
  test('names every series in text, so identity is never colour alone', () => {
    render(<PaceCurve />);
    ['Marathon', 'Half', '10K', '5K'].forEach((name) => {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    });
  });

  test('carries a description of what the chart shows', () => {
    render(<PaceCurve />);
    expect(screen.getByRole('img')).toHaveAccessibleName(/marathon line is far steeper/i);
  });

  test('every plotted line fits inside the six hour axis', () => {
    // The slowest pace on the axis is 8:00/km; the marathon at that pace is the
    // highest point drawn, and must not run off the top.
    const slowest = totalTimeFromPace(480, POPULAR_DISTANCES_KM.Marathon);
    expect(slowest).toBeLessThan(6 * 3600);
  });

  test('the drift claim in the surrounding copy holds', () => {
    const per5s = (km) => totalTimeFromPace(305, km) - totalTimeFromPace(300, km);
    expect(per5s(POPULAR_DISTANCES_KM['5K'])).toBe(25);
    expect(Math.round(per5s(POPULAR_DISTANCES_KM.Marathon))).toBe(211);
  });
});

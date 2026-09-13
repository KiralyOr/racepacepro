import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RacePredictor from './RacePredictor';

// This project has no jest-dom, so assertions read the DOM directly.
const row = (name) =>
  screen.getAllByRole('row').find((r) => r.textContent.startsWith(name));

const toSeconds = (clock) => {
  const parts = clock.split(':').map(Number);
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
};

const predictedSeconds = (name) => toSeconds(row(name).querySelectorAll('td')[1].textContent);

describe('RacePredictor', () => {
  test('shows the entered time back on the row it came from', () => {
    render(<RacePredictor />);
    expect(predictedSeconds('10K')).toBe(50 * 60);
  });

  test('marks which row the runner actually raced', () => {
    render(<RacePredictor />);
    expect(row('10K').textContent).toContain('your result');
    expect(row('Marathon').textContent).not.toContain('your result');
  });

  test('predicts every standard distance', () => {
    render(<RacePredictor />);
    ['5K', '10K', 'Half Marathon', 'Marathon'].forEach((name) => {
      expect(predictedSeconds(name)).toBeGreaterThan(0);
    });
  });

  test('longer distances always predict longer times', () => {
    render(<RacePredictor />);
    expect(predictedSeconds('5K')).toBeLessThan(predictedSeconds('10K'));
    expect(predictedSeconds('10K')).toBeLessThan(predictedSeconds('Half Marathon'));
    expect(predictedSeconds('Half Marathon')).toBeLessThan(predictedSeconds('Marathon'));
  });

  test('changing the source distance moves the marker', () => {
    render(<RacePredictor />);
    fireEvent.change(screen.getByLabelText('Distance you raced'), { target: { value: '5K' } });
    expect(row('5K').textContent).toContain('your result');
    expect(row('10K').textContent).not.toContain('your result');
  });

  test('the conservative setting predicts a slower marathon', () => {
    render(<RacePredictor />);
    const standard = predictedSeconds('Marathon');
    fireEvent.change(screen.getByLabelText('Training assumption'), {
      target: { value: 'conservative' },
    });
    expect(predictedSeconds('Marathon')).toBeGreaterThan(standard);
  });

  test('changing the entered time rescales every prediction', () => {
    render(<RacePredictor />);
    const before = predictedSeconds('Marathon');
    fireEvent.change(screen.getByLabelText('Minutes'), { target: { value: '40' } });
    expect(predictedSeconds('10K')).toBe(40 * 60);
    expect(predictedSeconds('Marathon')).toBeLessThan(before);
  });
});

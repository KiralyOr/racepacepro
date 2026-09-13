import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaceCalculator from './PaceCalculator';

const totalTime = () => screen.getByText('Total Time').parentElement.textContent;
const paceReadout = () => screen.getByText(/^Pace \(per/).parentElement.textContent;

describe('PaceCalculator', () => {
  test('shows the finish time for the default 5K at 5:00/km', () => {
    render(<PaceCalculator />);
    expect(totalTime()).toContain('00h');
    expect(totalTime()).toContain('25m');
    expect(totalTime()).toContain('00s');
  });

  test('recalculates when a longer distance is picked', () => {
    render(<PaceCalculator />);
    fireEvent.click(screen.getByLabelText('10K', { selector: 'input' }));
    expect(totalTime()).toContain('50m');
  });

  test('switching to miles keeps the finish time and converts the pace', () => {
    render(<PaceCalculator />);
    fireEvent.click(screen.getByRole('radio', { name: 'Miles' }));

    expect(totalTime()).toContain('25m');
    expect(screen.getByLabelText('min')).toHaveValue(8);
    expect(screen.getByLabelText('sec')).toHaveValue(3);
    expect(screen.getByText('3.11 mi')).toBeInTheDocument();
  });

  test('Time to Pace mode derives the pace from an edited time', () => {
    render(<PaceCalculator />);
    fireEvent.click(screen.getByRole('button', { name: 'Time → Pace' }));
    fireEvent.change(screen.getByLabelText('m'), { target: { value: '20' } });

    expect(paceReadout()).toContain('04m');
    expect(paceReadout()).toContain('00s');
  });

  test('a custom distance drives the calculation', () => {
    render(<PaceCalculator />);
    fireEvent.click(screen.getByRole('radio', { name: 'Custom' }));
    fireEvent.change(screen.getByLabelText('Custom distance'), { target: { value: '12' } });

    expect(totalTime()).toContain('01h');
    expect(totalTime()).toContain('00m');
  });
});

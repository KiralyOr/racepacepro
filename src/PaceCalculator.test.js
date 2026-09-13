import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaceCalculator from './PaceCalculator';

// The component persists to localStorage and rewrites the query string, so
// each test has to start from a clean slate or state leaks between them.
beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
});

const finishTime = () => screen.getByText('Finish time').parentElement.textContent;
const paceResult = () => screen.getByText(/^Required pace/).parentElement.textContent;

describe('calculating', () => {
  test('shows the finish time for the default 5K at 5:00/km', () => {
    render(<PaceCalculator />);
    expect(finishTime()).toContain('25:00');
  });

  test('recalculates when a longer distance is picked', () => {
    render(<PaceCalculator />);
    fireEvent.click(screen.getByRole('radio', { name: '10K' }));
    expect(finishTime()).toContain('50:00');
  });

  test('switching to miles keeps the finish time and converts the pace', () => {
    render(<PaceCalculator />);
    fireEvent.click(screen.getByRole('radio', { name: 'Miles' }));

    expect(finishTime()).toContain('25:00');
    // Selects report their value as a string.
    expect(screen.getByLabelText('min')).toHaveValue('8');
    expect(screen.getByLabelText('sec')).toHaveValue('3');
  });

  test('pace minutes cover the range a unit conversion can produce', () => {
    render(<PaceCalculator />);
    const options = Array.from(screen.getByLabelText('min').options).map((o) => o.value);
    expect(options).toContain('0');
    expect(options).toContain('59');
  });

  test('derives the pace from an edited goal time', () => {
    render(<PaceCalculator />);
    fireEvent.click(screen.getByRole('radio', { name: 'Time → Pace' }));
    fireEvent.change(screen.getByLabelText('min'), { target: { value: '20' } });

    expect(paceResult()).toContain('4:00');
  });

  test('a custom distance drives the calculation', () => {
    render(<PaceCalculator />);
    fireEvent.click(screen.getByRole('radio', { name: 'Custom' }));
    fireEvent.change(screen.getByLabelText('Custom distance'), { target: { value: '12' } });

    expect(finishTime()).toContain('1:00:00');
  });
});

describe('custom distance across unit switches', () => {
  const custom = () => screen.getByLabelText('Custom distance');
  const setCustom = (value) => {
    fireEvent.click(screen.getByRole('radio', { name: 'Custom' }));
    fireEvent.change(custom(), { target: { value } });
  };

  test('returns to the number originally typed after a round trip', () => {
    render(<PaceCalculator />);
    setCustom('10');

    fireEvent.click(screen.getByRole('radio', { name: 'Miles' }));
    expect(custom()).toHaveValue(6.21);

    fireEvent.click(screen.getByRole('radio', { name: 'Kilometres' }));
    expect(custom()).toHaveValue(10);
  });

  test('does not drift over repeated switches', () => {
    render(<PaceCalculator />);
    setCustom('10');

    for (let i = 0; i < 4; i += 1) {
      fireEvent.click(screen.getByRole('radio', { name: 'Miles' }));
      fireEvent.click(screen.getByRole('radio', { name: 'Kilometres' }));
    }

    expect(custom()).toHaveValue(10);
  });

  test('converts a distance typed in miles', () => {
    render(<PaceCalculator />);
    fireEvent.click(screen.getByRole('radio', { name: 'Miles' }));
    setCustom('26.2');

    fireEvent.click(screen.getByRole('radio', { name: 'Kilometres' }));
    expect(custom()).toHaveValue(42.16);
  });
});

describe('splits', () => {
  test('lists each kilometre and marks the finish', () => {
    render(<PaceCalculator />);
    expect(screen.getByRole('heading', { name: 'Split times' })).toBeInTheDocument();

    const rows = screen.getAllByRole('row').filter((r) => r.textContent.includes('km'));
    expect(rows).toHaveLength(5);
    expect(rows[4].textContent).toContain('5 km');
    expect(rows[4].textContent).toContain('25:00');
  });

  test('a negative split changes the pacing but not the finish time', () => {
    render(<PaceCalculator />);
    const before = finishTime();

    fireEvent.change(screen.getByLabelText('Split strategy'), { target: { value: 'neg2' } });

    expect(finishTime()).toBe(before);
    expect(screen.getByText(/Halfway · second half 2% quicker/)).toBeInTheDocument();
  });

  test('marks halfway only when a negative split is selected', () => {
    render(<PaceCalculator />);
    expect(screen.queryByText(/Halfway/)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Split strategy'), { target: { value: 'neg1' } });
    expect(screen.getByText(/Halfway/)).toBeInTheDocument();
  });
});

describe('pace zones', () => {
  test('labels the default 5:00/km as steady', () => {
    render(<PaceCalculator />);
    expect(screen.getByText('Steady pace')).toBeInTheDocument();
  });

  test('follows the pace into a different zone', () => {
    render(<PaceCalculator />);
    fireEvent.change(screen.getByLabelText('min'), { target: { value: '3' } });
    expect(screen.getByText('Interval pace')).toBeInTheDocument();
  });

  test('reports the pace in per-kilometre terms regardless of unit', () => {
    const seen = [];
    render(<PaceCalculator onPacePerKmChange={(v) => seen.push(v)} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Miles' }));

    // 5:00/km shown as 8:03/mile must still report ~300 s/km, not ~483.
    expect(seen[seen.length - 1]).toBeCloseTo(300, 0);
  });
});

describe('sharing', () => {
  test('reads the opening state out of the query string', () => {
    window.history.replaceState(null, '', '/?d=marathon&u=km&m=pace&p=300');
    render(<PaceCalculator />);

    expect(screen.getByRole('radio', { name: /^Marathon$/ })).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(finishTime()).toContain('3:30:59');
  });

  test('offers a copyable link', () => {
    render(<PaceCalculator />);
    expect(screen.getByRole('button', { name: /Copy shareable link/ })).toBeInTheDocument();
  });
});

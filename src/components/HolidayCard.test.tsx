import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HolidayCard } from './HolidayCard';
import * as dateUtils from '../utils/dateUtils';

// Mock getTodayDateString to control "past" vs "future" logic
vi.mock('../utils/dateUtils', () => ({
  getTodayDateString: vi.fn(),
}));

describe('HolidayCard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders correctly with given props', () => {
    // Mock today's date so this is a "future" holiday
    vi.mocked(dateUtils.getTodayDateString).mockReturnValue('2024-01-01');

    render(
      <HolidayCard
        fecha="2024-05-25"
        tipo="inamovible"
        nombre="Día de la Revolución de Mayo"
        color="bg-blue-500"
      />
    );

    // Check texts
    expect(screen.getByText('Día de la Revolución de Mayo')).toBeInTheDocument();
    expect(screen.getByText('inamovible')).toBeInTheDocument();

    // Check date formatting (May 25th)
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('MAY')).toBeInTheDocument(); // short month in Spanish es-AR uppercase
    expect(screen.getByText('sábado')).toBeInTheDocument(); // 2024-05-25 is Saturday

    // The component wrapper has color logic but the test shouldn't be too fragile about internal classes,
    // though we can check if color is present in the DOM.
    // The color class is applied to a div containing the calendar icon.
    // The closest thing to check is that a div with bg-blue-500 exists.
    const colorDivs = document.getElementsByClassName('bg-blue-500');
    expect(colorDivs.length).toBeGreaterThan(0);
  });

  it('applies styling for past holidays', () => {
    // Mock today's date so this is a "past" holiday
    vi.mocked(dateUtils.getTodayDateString).mockReturnValue('2024-06-01');

    const { container } = render(
      <HolidayCard
        fecha="2024-05-25"
        tipo="inamovible"
        nombre="Día de la Revolución de Mayo"
        color="bg-blue-500"
      />
    );

    // Look for the specific classes added when isPast is true
    // 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
    const cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv.className).toContain('opacity-50');
    expect(cardDiv.className).toContain('grayscale');
  });

  it('does not apply past styling for future/current holidays', () => {
    // Current holiday
    vi.mocked(dateUtils.getTodayDateString).mockReturnValue('2024-05-25');

    const { container } = render(
      <HolidayCard
        fecha="2024-05-25"
        tipo="inamovible"
        nombre="Día de la Revolución de Mayo"
        color="bg-blue-500"
      />
    );

    const cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv.className).not.toContain('opacity-50');
    expect(cardDiv.className).not.toContain('grayscale');
  });
});

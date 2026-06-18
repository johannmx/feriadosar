import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HolidayCard } from './HolidayCard';

describe('HolidayCard', () => {
  it('renders correctly with given props', () => {
    render(
      <HolidayCard
        fecha="2024-05-25"
        tipo="inamovible"
        nombre="Día de la Revolución de Mayo"
        color="bg-blue-500"
        isPast={false}
      />
    );

    // Check texts
    expect(screen.getByText('Día de la Revolución de Mayo')).toBeInTheDocument();
    expect(screen.getByText('inamovible')).toBeInTheDocument();

    // Check date formatting (May 25th)
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText(/^MAY\.?$/i)).toBeInTheDocument(); // short month in Spanish es-AR uppercase often includes a dot depending on environment, but based on my manual test it was 'MAY.' or 'MAY'
    expect(screen.getByText('sábado')).toBeInTheDocument(); // 2024-05-25 is Saturday

    const colorDivs = document.getElementsByClassName('bg-blue-500');
    expect(colorDivs.length).toBeGreaterThan(0);
  });

  it('applies styling for past holidays', () => {
    const { container } = render(
      <HolidayCard
        fecha="2024-05-25"
        tipo="inamovible"
        nombre="Día de la Revolución de Mayo"
        color="bg-blue-500"
        isPast={true}
      />
    );

    const cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv.className).toContain('opacity-50');
    expect(cardDiv.className).toContain('grayscale');
  });

  it('does not apply past styling for future/current holidays', () => {
    const { container } = render(
      <HolidayCard
        fecha="2024-05-25"
        tipo="inamovible"
        nombre="Día de la Revolución de Mayo"
        color="bg-blue-500"
        isPast={false}
      />
    );

    const cardDiv = container.firstChild as HTMLElement;
    expect(cardDiv.className).not.toContain('opacity-50');
    expect(cardDiv.className).not.toContain('grayscale');
  });
});

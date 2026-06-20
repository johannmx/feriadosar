import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { CalendarView } from './CalendarView';
import type { Holiday } from '../types/holiday';

describe('CalendarView', () => {
  const mockHolidays: Holiday[] = [
    { fecha: '2026-05-25', tipo: 'inamovible', nombre: 'Día de la Revolución de Mayo' },
    { fecha: '2026-06-20', tipo: 'trasladable', nombre: 'Paso a la Inmortalidad del General Manuel Belgrano' },
    { fecha: '2026-07-09', tipo: 'puente', nombre: 'Día de la Independencia' },
  ];

  it('renders all 12 months', () => {
    render(<CalendarView year={2026} holidays={mockHolidays} todayStr="2026-06-20" />);

    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    months.forEach((month) => {
      expect(screen.getByRole('heading', { name: month })).toBeInTheDocument();
    });
  });

  it('highlights holiday dates with correct color classes', () => {
    render(<CalendarView year={2026} holidays={mockHolidays} todayStr="2026-01-01" />);

    // May 25th (inamovible) should have orange background/text classes
    const mayoHeading = screen.getByRole('heading', { name: 'Mayo' });
    const mayoContainer = mayoHeading.closest('div');
    const mayo25Cell = within(mayoContainer!).getByText('25').closest('.relative');
    expect(mayo25Cell?.className).toContain('bg-orange-100');
    expect(mayo25Cell?.className).toContain('text-orange-700');

    // June 20th (trasladable) should have blue background/text classes
    const junioHeading = screen.getByRole('heading', { name: 'Junio' });
    const junioContainer = junioHeading.closest('div');
    const junio20Cell = within(junioContainer!).getByText('20').closest('.relative');
    expect(junio20Cell?.className).toContain('bg-blue-100');
    expect(junio20Cell?.className).toContain('text-blue-700');
  });

  it('highlights today date with ring/indigo classes', () => {
    render(<CalendarView year={2026} holidays={mockHolidays} todayStr="2026-06-20" />);

    // June 20th should be highlighted as today
    const junioHeading = screen.getByRole('heading', { name: 'Junio' });
    const junioContainer = junioHeading.closest('div');
    const junio20Cell = within(junioContainer!).getByText('20').closest('.relative');
    expect(junio20Cell?.className).toContain('ring-2');
    expect(junio20Cell?.className).toContain('ring-indigo-500');
  });
});

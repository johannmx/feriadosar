import { Calendar } from 'lucide-react';

interface HolidayCardProps {
  fecha: string;
  tipo: string;
  nombre: string;
  color: string;
}

export const HolidayCard = ({ fecha, tipo, nombre, color }: HolidayCardProps) => {
  const dateObj = new Date(fecha + 'T00:00:00'); // Prevent timezone shift
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase();
  const weekday = dateObj.toLocaleDateString('es-AR', { weekday: 'long' });

  // Use local time from env if possible, otherwise browser time
  // Current time is 2026-03-25T15:25:47-03:00 -> en-CA formats to '2026-03-25'

  const isPast = fecha < new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });

  return (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 relative overflow-hidden group h-full justify-between min-h-[200px] flex flex-col ${isPast ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}>
      <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
        {tipo}
      </span>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} shadow-sm group-hover:scale-110 transition-transform`}>
           <Calendar className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex flex-col items-end mt-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{weekday}</span>
        </div>
      </div>

      <div className="space-y-1 mt-auto">
        <div className="flex items-baseline gap-2">
          <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">{day}</h3>
          <span className="text-xl font-bold text-slate-400 dark:text-slate-500">{month}</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-bold tracking-tight mt-2">{nombre}</p>
      </div>
    </div>
  );
};

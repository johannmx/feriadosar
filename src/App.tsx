import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor, CalendarDays, ChevronDown } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { HolidayCard } from './components/HolidayCard';
import { CalendarView } from './components/CalendarView';

interface Holiday {
  fecha: string;
  tipo: string;
  nombre: string;
}

const COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-indigo-500',
];

export default function App() {
  const { theme, setTheme } = useTheme();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'feriados' | 'calendario'>('feriados');
  const [apiStatus, setApiStatus] = useState<'checking' | 'up' | 'down'>('checking');

  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.argentinadatos.com/v1/feriados/${year}`);
        if (!res.ok) throw new Error('API down');
        const data = await res.json();
        setHolidays(data);
        setApiStatus('up');
      } catch (error) {
        setApiStatus('down');
        console.error('Error fetching holidays', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, [year]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 pb-10 lg:pb-48 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 dark:bg-white p-2.5 rounded-2xl shadow-xl rotate-3">
                <CalendarDays className="w-8 h-8 text-white dark:text-slate-900" />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                FERIADOS<span className="text-blue-600 dark:text-blue-400">AR</span>
              </h1>
            </div>
            <p className="mt-2 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              CALENDARIO ANUAL DE FERIADOS EN ARGENTINA {year}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold px-5 py-2.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300"
              >
                {year}
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-2xl overflow-hidden min-w-[120px] max-h-56 overflow-y-auto z-50">
                  <div className="flex flex-col py-2">
                    {[...Array(11)].map((_, i) => {
                      const y = 2026 - i; // Ordenar del más nuevo al más viejo
                      return (
                        <button
                          key={y}
                          onClick={() => {
                            setYear(y);
                            setIsDropdownOpen(false);
                          }}
                          className={`px-5 py-2 text-sm text-left font-bold transition-colors
                            ${year === y 
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                          {y}
                        </button>
                      );
                    })}
                  </div>
                </div>
                </>
              )}
            </div>
            
            {/* TEMA TOGGLE */}
            <div className="flex bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 p-1">
              <button onClick={() => setTheme('light')} className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}><Sun className="w-4 h-4" /></button>
              <button onClick={() => setTheme('system')} className={`p-2 rounded-full transition-all ${theme === 'system' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}><Monitor className="w-4 h-4" /></button>
              <button onClick={() => setTheme('dark')} className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}><Moon className="w-4 h-4" /></button>
            </div>
          </div>
        </header>

        {/* TAB SWITCHER */}
        <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-full w-full max-w-sm mx-auto mb-10 border border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('feriados')}
            className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${activeTab === 'feriados' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Feriados
          </button>
          <button 
            onClick={() => setActiveTab('calendario')}
            className={`flex-1 py-2 text-sm font-bold rounded-full transition-all duration-300 ${activeTab === 'calendario' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Calendario
          </button>
        </div>

        {/* LEGEND (Only for Calendar View) */}
        {!loading && activeTab === 'calendario' && (
          <div className="flex flex-wrap justify-center gap-6 mb-10 transition-all duration-500 ease-in-out">
            {[
              { label: 'Inamovible', color: 'bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800' },
              { label: 'Trasladable', color: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800' },
              { label: 'Puente', color: 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800' },
              { label: 'Hoy', color: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 ring-2 ring-indigo-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-md border ${item.color}`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : activeTab === 'feriados' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {holidays.map((holiday, idx) => (
              <HolidayCard 
                key={`${holiday.fecha}-${idx}`} 
                fecha={holiday.fecha} 
                tipo={holiday.tipo} 
                nombre={holiday.nombre}
                color={COLORS[idx % COLORS.length]} 
              />
            ))}
          </div>
        ) : (
          <CalendarView year={year} holidays={holidays} />
        )}

        {/* FOOTER FIXED - EFECTO BLUR / GLASSMORPHISM */}
        <footer className="relative lg:fixed lg:bottom-0 lg:left-0 lg:right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-4 lg:px-8 py-3 lg:py-5 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left: Author */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                REALIZADO POR <span className="text-slate-900 dark:text-white">@JOHANNMX</span>
              </span>
            </div>

            {/* Center: Tech Pill */}
            <div className="flex bg-slate-100 dark:bg-slate-800/50 px-4 py-1.5 rounded-full items-center gap-3 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">BUILT WITH</span>
              <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700" />
              <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">Vite + React + Tailwind</span>
            </div>

            {/* Right: API Status */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-1.5 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="relative flex h-2 w-2">
                {apiStatus !== 'checking' && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${apiStatus === 'up' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${apiStatus === 'up' ? 'bg-emerald-500' : apiStatus === 'down' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`}></span>
              </div>
              <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {apiStatus === 'up' ? 'API ONLINE' : apiStatus === 'down' ? 'API OFFLINE' : 'CHECKING API'}
              </span>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}



interface Holiday {
  fecha: string;
  tipo: string;
  nombre: string;
}

interface CalendarViewProps {
  year: number;
  holidays: Holiday[];
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const CalendarView = ({ year, holidays }: CalendarViewProps) => {
  // Map from "YYYY-MM-DD" to holiday object
  const holidayMap = new Map<string, Holiday>();
  holidays.forEach(h => holidayMap.set(h.fecha, h));

  // Use local time matching Argentina
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {MONTHS.map((monthName, mIdx) => {
        const daysInMonth = new Date(year, mIdx + 1, 0).getDate();
        // firstDay index: 0 is Monday ... 6 is Sunday
        let firstDay = new Date(year, mIdx, 1).getDay() - 1; 
        if (firstDay === -1) firstDay = 6;

        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
          <div key={monthName} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase mb-4 text-center">{monthName}</h3>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <div key={`${monthName}-dow-${i}`} className="text-[10px] font-black tracking-widest text-slate-400">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
              
              {days.map(day => {
                const dateStr = `${year}-${String(mIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const holiday = holidayMap.get(dateStr);
                const dateObj = new Date(year, mIdx, day);
                const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                const isToday = dateStr === todayStr;

                let colorClasses = "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50";
                
                if (holiday) {
                  if (holiday.tipo === "inamovible") {
                    colorClasses = "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 font-bold hover:bg-orange-200 dark:hover:bg-orange-900/60";
                  } else if (holiday.tipo === "trasladable") {
                    colorClasses = "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-bold hover:bg-blue-200 dark:hover:bg-blue-900/60";
                  } else if (holiday.tipo === "puente") {
                    colorClasses = "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-bold hover:bg-green-200 dark:hover:bg-green-900/60";
                  } else {
                    colorClasses = "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 font-bold hover:bg-purple-200 dark:hover:bg-purple-900/60";
                  }
                } else if (isWeekend) {
                  colorClasses = "text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50";
                }

                return (
                  <div 
                    key={dateStr} 
                    className={`relative group p-1.5 rounded-lg text-xs flex items-center justify-center cursor-default transition-colors ${colorClasses} ${isToday ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-800 bg-indigo-50 dark:bg-indigo-900/30' : ''}`}
                  >
                    {day}
                    
                    {holiday && (
                      <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] py-2 px-3 rounded-xl shadow-xl whitespace-nowrap transition-all duration-200 pointer-events-none">
                        <div className="uppercase tracking-widest text-[8px] font-black opacity-60 mb-1">{holiday.tipo}</div>
                        <div className="font-bold">{holiday.nombre}</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900 dark:border-t-white"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

# 🚀 MarketDash UI Template (Vite + React + Tailwind)

Sigue estos pasos para aplicar exactamente el mismo diseño, tipografía y estilo global de tu aplicación actual a cualquier proyecto nuevo.

## 1. Configuración de Tailwind (`tailwind.config.js`)

Para lograr el mismo aspecto "Premium" moderno y ordenado, asegúrate de que tu Tailwind incluya la tipografía **Outfit** (o la que uses actualmente) y colores extendidos si es que los necesitas. Tu archivo de configuración base se vería así:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ¡Crucial para que funcione el toggle System/Light/Dark!
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'], // Tipografías modernas
      },
    },
  },
  plugins: [],
}
```

## 2. Estilos Globales ([index.css](file:///Users/johann/Documents/_JBASH/_GitHub/valores-mercado/web/client/src/index.css))

Aquí manejamos el fondo adaptativo para las áreas de scroll nativas (iOS Safari `bg` y `theme-color` implícito) además de tipografías:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html, body, #root {
    @apply bg-slate-50 dark:bg-slate-900 m-0 p-0 min-h-screen text-slate-900 dark:text-white font-sans transition-colors duration-300;
  }
}
```

## 3. Gestor de Tema Global (Hook en tu [App.tsx](file:///Users/johann/Documents/_JBASH/_GitHub/valores-mercado/web/client/src/App.tsx) o `Layout`)

Para preservar la lógica idéntica de tu botón de Claro/Oscuro/Sistema que previene flashes blancos e inyecta la meta-etiqueta a móviles:

```tsx
import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    let activeTheme = theme;
    if (theme === 'system') {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    root.classList.add(activeTheme);
    localStorage.setItem('theme', theme);

    // Ajuste iOS Safari
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', activeTheme === 'dark' ? '#0f172a' : '#f8fafc');
  }, [theme]);

  return { theme, setTheme };
}
```

## 4. Estructura Principal de Pantalla Completa (Skeleton Layout)

Cuando construyas la estructura de tu nuevo [App.tsx](file:///Users/johann/Documents/_JBASH/_GitHub/valores-mercado/web/client/src/App.tsx) o vistas, usa estas clases base de Tailwind que determinan el contenedor ancho máximo, el "Header" con los botones, y un "Footer" flotante desenfocado.

```tsx
import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from './hooks/useTheme';

export default function Layout() {
  const { theme, setTheme } = useTheme();

  return (
    // CONTENEDOR RAIZ
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 pb-10 lg:pb-48 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 dark:bg-white p-2.5 rounded-2xl shadow-xl rotate-3">
                {/* ICONO TUYO AQUI */}
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                TU<span className="text-blue-600 dark:text-blue-400">APP</span>
              </h1>
            </div>
            <p className="mt-2 text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              Subtítulo de estilo premium
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* TEMA TOGGLE */}
            <div className="flex bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 p-1">
              <button onClick={() => setTheme('light')} className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}><Sun className="w-4 h-4" /></button>
              <button onClick={() => setTheme('system')} className={`p-2 rounded-full transition-all ${theme === 'system' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}><Monitor className="w-4 h-4" /></button>
              <button onClick={() => setTheme('dark')} className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}><Moon className="w-4 h-4" /></button>
            </div>
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL AQUI (GRIDS USANDO gap-16 o gap-6) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12">
            {/* AQUI VAN TUS STAT CARDS O CUALQUIER OTRA COSA */}
        </div>

        {/* FOOTER FIXED - EFECTO BLUR / GLASSMORPHISM */}
        <footer className="relative lg:fixed lg:bottom-0 lg:left-0 lg:right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-4 lg:px-8 py-3 lg:py-4 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Creado por ti
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
```

## 5. El Componente Diamante: [StatCard](file:///Users/johann/Documents/_JBASH/_GitHub/valores-mercado/web/client/src/App.tsx#99-152)

Este es el componente de tarjeta flotante "Glass/Premium" que has estado utilizando para los valores, con la tendencia dinámica de Subida/Bajada (rojo, verde, gris):

```tsx
import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, color, subtitle, buy, sell, change, badge }: any) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  const displayValue = value || '---';

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 relative overflow-hidden group h-full justify-between min-h-[220px]">
      {badge && (
        <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      <div className="flex items-center justify-between mb-4">
        {/* ICONO */}
        <div className={`p-3 rounded-xl ${color} shadow-sm group-hover:scale-110 transition-transform`}>
           <Icon className="w-6 h-6 text-white" />
        </div>
        
        {/* TENDENCIA DINAMICA */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</span>
          {change !== undefined && (
            <div className="flex flex-col items-end gap-1">
              <span className={`flex items-center gap-0.5 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isNeutral ? 'text-slate-500 bg-slate-100 dark:bg-slate-700' :
                isPositive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {isNeutral ? <TrendingUp className="w-3 h-3 text-slate-400" /> : isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change ? Math.abs(change).toFixed(2) : '0.00'}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* VALOR */}
      <div className="space-y-1">
        <h3 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">{displayValue}</h3>
        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter mt-1">{subtitle}</p>}
        
        {/* PIE DE COMPRA Y VENTA OPCIONAL */}
        {(buy !== undefined || sell !== undefined) && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50 text-[10px] font-bold uppercase">
            <div className="flex flex-col">
              <span className="text-slate-300 dark:text-slate-500 mb-0.5">Compra</span>
              <span className="text-slate-600 dark:text-slate-300">$ {buy || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-300 dark:text-slate-500 mb-0.5">Venta</span>
              <span className="text-slate-600 dark:text-slate-300">$ {sell || '-'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

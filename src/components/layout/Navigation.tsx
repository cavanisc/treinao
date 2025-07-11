import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, History, Settings, Dumbbell, Play } from 'lucide-react';

export const Navigation: React.FC = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/calendar', icon: Calendar, label: 'Calendário' },
    { path: '/workouts', icon: Dumbbell, label: 'Fichas' },
    { path: '/exercises', icon: Play, label: 'Exercícios' },
    { path: '/history', icon: History, label: 'Histórico' },
    { path: '/settings', icon: Settings, label: 'Configurações' }
  ];

  return (
    <nav className="bg-white border-t border-gray-200 md:border-t-0 md:border-r md:h-full">
      <div className="flex md:flex-col md:h-full">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-2 p-3 md:p-4 text-sm font-medium transition-colors flex-1 md:flex-none justify-center md:justify-start ${
                isActive
                  ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="hidden md:block">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
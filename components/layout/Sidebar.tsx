
import React, { useContext } from 'react';
import { NAV_ITEMS, SunIcon, MoonIcon } from '../../constants';
import type { Page, Theme } from '../../types';
import { AppContext } from '../../App';
import type { AppContextType } from '../../types';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { theme, setTheme } = useContext(AppContext) as AppContextType;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-card-light dark:bg-card-dark border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">FTTH Predict</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              currentPage === item.id
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-text-light-secondary dark:text-dark-secondary hover:bg-primary-50 dark:hover:bg-slate-700'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center p-2 rounded-lg text-text-light-secondary dark:text-dark-secondary hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          <span className="ml-2 text-sm font-medium">{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
        </button>
      </div>
    </aside>
  );
};

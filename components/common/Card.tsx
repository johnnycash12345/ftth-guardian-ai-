import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle, actions }) => {
  return (
    <div className={`bg-card-light dark:bg-card-dark rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
      {(title || actions) && (
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start">
          <div>
            {title && <h3 className="text-lg font-semibold text-text-light-primary dark:text-dark-primary">{title}</h3>}
            {subtitle && <p className="text-sm text-text-light-secondary dark:text-dark-secondary mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2 flex-shrink-0 ml-4">{actions}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

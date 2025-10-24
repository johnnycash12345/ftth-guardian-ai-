
import React from 'react';

interface TableProps<T> {
  columns: { key: keyof T; header: string; render?: (item: T) => React.ReactNode }[];
  data: T[];
  renderActions?: (item: T) => React.ReactNode;
}

export function Table<T extends { [key: string]: any },>({ columns, data, renderActions }: TableProps<T>): React.ReactElement {
  return (
    <div className="overflow-x-auto">
      <div className="align-middle inline-block min-w-full">
        <div className="shadow overflow-hidden border-b border-slate-200 dark:border-slate-700 sm:rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-text-light-secondary dark:text-dark-secondary uppercase tracking-wider"
                  >
                    {col.header}
                  </th>
                ))}
                {renderActions && (
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-card-light dark:bg-card-dark divide-y divide-slate-200 dark:divide-slate-700">
              {data.length > 0 ? data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-sm text-text-light-primary dark:text-dark-primary">
                      {col.render ? col.render(item) : String(item[col.key])}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {renderActions(item)}
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-10 text-slate-500">
                    Nenhum dado encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, lastPage, total, onPageChange }) => {
  if (total === 0) return null;

  return (
    <div className="py-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-text-light-secondary dark:text-dark-secondary">
          Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{lastPage}</span>
        </p>
      </div>
      <div className="flex-1 flex justify-end">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-text-light-secondary dark:text-dark-secondary bg-card-light dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-text-light-secondary dark:text-dark-secondary bg-card-light dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

export const Table = React.forwardRef(function Table<T>(
  {
    columns,
    data,
    keyExtractor,
    onRowClick,
    isLoading,
  }: TableProps<T>,
  ref: React.Ref<HTMLTableElement>,
) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        ref={ref}
        className="w-full border-collapse border border-gray-200 dark:border-slate-700"
      >
        <thead className="bg-gray-100 dark:bg-slate-700">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-white border-b dark:border-slate-600"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={keyExtractor(row, rowIndex)}
              className={`border-b dark:border-slate-700 ${
                onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800' : ''
              }`}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 text-sm ${column.className || ''}`}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : (row[column.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

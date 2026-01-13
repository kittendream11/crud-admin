'use client';

/**
 * Loading skeleton component for data placeholders
 * Provides smooth skeleton screens during data loading
 */

interface SkeletonProps {
  variant?: 'text' | 'card' | 'table-row' | 'form';
  count?: number;
  width?: string;
  height?: string;
  className?: string;
}

function SkeletonText({ width = 'w-full', height = 'h-4', className = '' }: Omit<SkeletonProps, 'variant' | 'count'>) {
  return (
    <div
      className={`bg-gray-300 dark:bg-gray-700 rounded ${width} ${height} animate-pulse ${className}`}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <SkeletonText width="w-3/4" height="h-6" />
      <SkeletonText height="h-4" />
      <SkeletonText height="h-4" />
      <SkeletonText width="w-1/2" height="h-4" />
    </div>
  );
}

function SkeletonTableRow() {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-6 py-4">
          <SkeletonText />
        </td>
      ))}
    </tr>
  );
}

function SkeletonForm() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <SkeletonText width="w-1/4" height="h-4" />
          <SkeletonText height="h-10" />
        </div>
      ))}
      <div className="flex gap-4">
        <SkeletonText width="w-20" height="h-10" />
        <SkeletonText width="w-20" height="h-10" />
      </div>
    </div>
  );
}

export default function Skeleton({
  variant = 'text',
  count = 1,
  width = 'w-full',
  height = 'h-4',
  className = '',
}: SkeletonProps) {
  const components = {
    text: <SkeletonText width={width} height={height} className={className} />,
    card: <SkeletonCard />,
    'table-row': <SkeletonTableRow />,
    form: <SkeletonForm />,
  };

  const component = components[variant];

  if (count === 1) {
    return component;
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {component}
        </div>
      ))}
    </div>
  );
}

/**
 * Table skeleton loader
 */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            {[1, 2, 3, 4, 5].map((i) => (
              <th key={i} className="px-6 py-4 text-left">
                <SkeletonText height="h-4" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} variant="table-row" />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Grid skeleton loader
 */
export function SkeletonGrid({ columns = 4, rows = 4 }: { columns?: number; rows?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {Array.from({ length: rows * columns }).map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  );
}

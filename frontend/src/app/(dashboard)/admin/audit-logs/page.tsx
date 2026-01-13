'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import contentService from '@/services/content.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import Table from '@/components/Table';

interface AuditLog {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entity: string;
  entityId: string;
  description: string;
  changes?: Record<string, any>;
  userId?: string;
  ipAddress?: string;
  createdAt: string;
}

const actionColors = {
  CREATE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  LOGIN: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  LOGOUT: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<'all' | 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'>('all');
  const [entityFilter, setEntityFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page, actionFilter, entityFilter],
    queryFn: () =>
      contentService.getAuditLogs({
        page,
        limit: 20,
        action: actionFilter !== 'all' ? actionFilter : undefined,
        entity: entityFilter !== 'all' ? entityFilter : undefined,
      } as any),
  });

  const columns = [
    {
      header: 'Action',
      accessor: (row: AuditLog) => (
        <span className={`px-2 py-1 rounded text-sm font-semibold ${actionColors[row.action]}`}>
          {row.action}
        </span>
      ),
    },
    {
      header: 'Entity',
      accessor: (row: AuditLog) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{row.entity}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.entityId}</p>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description' as const,
      className: 'truncate max-w-xs',
    },
    {
      header: 'IP Address',
      accessor: (row: AuditLog) => row.ipAddress || '-',
    },
    {
      header: 'Timestamp',
      accessor: (row: AuditLog) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white">
            {new Date(row.createdAt).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.createdAt).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole={['admin']}>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Audit Logs</h1>

        <div className="mb-4 flex gap-4 flex-wrap">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value as any);
              setPage(1);
            }}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
          </select>

          <select
            value={entityFilter}
            onChange={(e) => {
              setEntityFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Entities</option>
            <option value="User">User</option>
            <option value="Article">Article</option>
            <option value="Category">Category</option>
            <option value="RefreshToken">Token</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <Table
            columns={columns}
            data={data?.data || []}
            isLoading={isLoading}
          />
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
            Page {page} of {Math.ceil((data?.total || 0) / 20)}
          </span>
          <Button
            variant="secondary"
            disabled={page * 20 >= (data?.total || 0)}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

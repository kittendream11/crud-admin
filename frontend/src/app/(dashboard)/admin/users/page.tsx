'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { userService, User } from '@/services/user.service';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', { page, search }],
    queryFn: () => userService.getUsers({ page, limit: 10, search }),
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure?')) {
      try {
        await userService.deleteUser(id);
        toast.success('User deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <ProtectedRoute requiredRole={['admin', 'moderator']}>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Users</h1>
          <Link href="/admin/users/create">
            <Button variant="primary">Add User</Button>
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700"
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <Table
            columns={[
              { header: 'Email', accessor: 'email' },
              { header: 'Name', accessor: (row: User) => `${row.firstName} ${row.lastName}` },
              { header: 'Role', accessor: 'role' },
              {
                header: 'Status',
                accessor: (row: User) => (
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      row.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900'
                        : 'bg-red-100 text-red-800 dark:bg-red-900'
                    }`}
                  >
                    {row.isActive ? 'Active' : 'Inactive'}
                  </span>
                ),
              },
              {
                header: 'Actions',
                accessor: (row: User) => (
                  <div className="flex gap-2">
                    <Link href={`/admin/users/${row.id}`}>
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(row.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            data={data?.data || []}
            keyExtractor={(row, index) => `${row.id}-${index}`}
            isLoading={isLoading}
          />
        </div>

        {data && data.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'primary' : 'secondary'}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

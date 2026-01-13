'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import contentService from '@/services/content.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import Table from '@/components/Table';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['categories', page, search],
    queryFn: () =>
      contentService.getCategories({
        page,
        limit: 10,
        search,
      }),
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await contentService.deleteCategory(id);
      toast.success('Category deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: (row: Category) => <span className="font-semibold">{row.name}</span>,
    },
    {
      header: 'Slug',
      accessor: 'slug' as const,
    },
    {
      header: 'Description',
      accessor: 'description' as const,
      className: 'truncate max-w-xs',
    },
    {
      header: 'Status',
      accessor: (row: Category) => (
        <span
          className={`px-2 py-1 rounded text-sm font-semibold ${
            row.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Category) => (
        <div className="flex gap-2">
          <Link href={`/admin/content/categories/${row.id}`}>
            <Button variant="primary" size="sm">
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
  ];

  return (
    <ProtectedRoute requiredRole={['admin']}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <Link href="/admin/content/categories/new">
            <Button variant="primary">Create Category</Button>
          </Link>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
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
            Page {page} of {Math.ceil((data?.total || 0) / 10)}
          </span>
          <Button
            variant="secondary"
            disabled={page * 10 >= (data?.total || 0)}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

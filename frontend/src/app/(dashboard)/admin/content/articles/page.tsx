'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import contentService from '@/services/content.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import { Table } from '@/components/Table';
import toast from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
}

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['articles', page, search, statusFilter],
    queryFn: () =>
      contentService.getArticles({
        page,
        limit: 10,
        search,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      }),
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await contentService.deleteArticle(id);
      toast.success('Article deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete article');
    }
  };

  const handleStatusChange = async (id: string, action: 'publish' | 'archive') => {
    try {
      if (action === 'publish') {
        await contentService.publishArticle(id);
        toast.success('Article published');
      } else {
        await contentService.archiveArticle(id);
        toast.success('Article archived');
      }
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update article');
    }
  };

  const columns = [
    {
      header: 'Title',
      accessor: (row: Article) => <span className="font-semibold">{row.title}</span>,
      className: 'font-medium',
    },
    {
      header: 'Slug',
      accessor: 'slug' as const,
    },
    {
      header: 'Status',
      accessor: (row: Article) => (
        <span
          className={`px-2 py-1 rounded text-sm font-semibold ${
            row.status === 'published'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : row.status === 'draft'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
    },
    {
      header: 'Created',
      accessor: (row: Article) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: (row: Article) => (
        <div className="flex gap-2">
          <Link href={`/admin/content/articles/${row.id}`}>
            <Button variant="primary" size="sm">
              Edit
            </Button>
          </Link>
          {row.status === 'draft' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusChange(row.id, 'publish')}
            >
              Publish
            </Button>
          )}
          {row.status === 'published' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleStatusChange(row.id, 'archive')}
            >
              Archive
            </Button>
          )}
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
    <ProtectedRoute requiredRole={['moderator', 'admin']}>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Articles</h1>
          <Link href="/admin/content/articles/new">
            <Button variant="primary">Create Article</Button>
          </Link>
        </div>

        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <Table
            columns={columns as any}
            data={data?.data || []}
            isLoading={isLoading}
            keyExtractor={(row: any) => row.id}
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

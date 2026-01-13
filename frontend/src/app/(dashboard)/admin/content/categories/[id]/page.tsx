'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import contentService from '@/services/content.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters').optional(),
  icon: z.string().optional(),
  order: z.number().min(0, 'Order must be 0 or higher').optional(),
  isActive: z.boolean().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: category, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => contentService.getCategoryById(id),
    enabled: !isNew,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const isActive = watch('isActive');

  useEffect(() => {
    if (category && !isNew) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        order: category.order || 0,
        isActive: category.isActive,
      });
    }
  }, [category, isNew, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      if (isNew) {
        await contentService.createCategory({
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          icon: data.icon || '',
          order: data.order || 0,
        });
        toast.success('Category created successfully');
      } else {
        await contentService.updateCategory(id, {
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          icon: data.icon || '',
          order: data.order || 0,
        });
        toast.success('Category updated successfully');
      }
      router.push('/admin/content/categories');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole={['admin']}>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole={['admin']}>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isNew ? 'Create Category' : 'Edit Category'}
          </h1>
          <Button
            variant="secondary"
            onClick={() => router.back()}
          >
            ← Back
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Category name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Slug
            </label>
            <input
              type="text"
              {...register('slug')}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="category-slug"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Category description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Icon (emoji or Unicode)
            </label>
            <input
              type="text"
              {...register('icon')}
              maxLength={4}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="📁"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Order
            </label>
            <input
              type="number"
              {...register('order', { valueAsNumber: true })}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="0"
              min="0"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register('isActive')}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
            />
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Category'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}

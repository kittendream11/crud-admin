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

const articleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags: z.string().transform(s => s.split(',').map(t => t.trim()).filter(Boolean)),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => contentService.getArticleById(id),
    enabled: !isNew,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: article ? {
      title: article.title,
      slug: article.slug,
      content: article.content,
      description: article.description,
      featuredImage: article.featuredImage || '',
      tags: article.tags?.join(', ') || '',
    } : undefined,
  });

  useEffect(() => {
    if (article && !isNew) {
      reset({
        title: article.title,
        slug: article.slug,
        content: article.content,
        description: article.description,
        featuredImage: article.featuredImage || '',
        tags: article.tags?.join(', ') || '',
      });
    }
  }, [article, isNew, reset]);

  const onSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    try {
      if (isNew) {
        await contentService.createArticle({
          title: data.title,
          slug: data.slug,
          content: data.content,
          description: data.description,
          featuredImage: data.featuredImage || undefined,
          tags: data.tags,
        });
        toast.success('Article created successfully');
      } else {
        await contentService.updateArticle(id, {
          title: data.title,
          slug: data.slug,
          content: data.content,
          description: data.description,
          featuredImage: data.featuredImage || undefined,
          tags: data.tags,
        });
        toast.success('Article updated successfully');
      }
      router.push('/admin/content/articles');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole={['moderator', 'admin']}>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole={['moderator', 'admin']}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isNew ? 'Create Article' : 'Edit Article'}
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
              Title
            </label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Article title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Slug
            </label>
            <input
              type="text"
              {...register('slug')}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="article-slug"
            />
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              {...register('description')}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Brief description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              {...register('content')}
              rows={10}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Article content"
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Featured Image URL (Optional)
            </label>
            <input
              type="url"
              {...register('featuredImage')}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
            {errors.featuredImage && <p className="text-red-500 text-sm mt-1">{errors.featuredImage.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              {...register('tags')}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Article'}
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

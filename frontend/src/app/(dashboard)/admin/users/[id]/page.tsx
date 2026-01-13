'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import userService from '@/services/user.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['admin', 'moderator', 'viewer']),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    } : undefined,
  });

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      await userService.updateUser(id, {
        firstName: data.firstName,
        lastName: data.lastName,
      });
      
      if (user && user.role !== data.role) {
        await userService.updateUserRole(id, data.role);
      }

      toast.success('User updated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;

    try {
      await userService.deactivateUser(id);
      toast.success('User deactivated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to deactivate user');
    }
  };

  const handleActivate = async () => {
    try {
      await userService.activateUser(id);
      toast.success('User activated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to activate user');
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
            Edit User: {user?.firstName} {user?.lastName}
          </h1>
          <Button
            variant="secondary"
            onClick={() => router.back()}
          >
            ← Back
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Information</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email}
                disabled
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 bg-gray-100 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                {...register('firstName')}
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                {...register('lastName')}
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Role
              </label>
              <select
                {...register('role')}
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="viewer">Viewer</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
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

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Status</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Status</p>
                  <p className={`mt-1 px-3 py-1 rounded inline-block text-sm font-semibold ${
                    user?.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>

                {user?.lastLogin && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Login</p>
                    <p className="text-gray-900 dark:text-white mt-1">
                      {new Date(user.lastLogin).toLocaleString()}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {new Date(user?.createdAt || '').toLocaleString()}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  {user?.isActive ? (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={handleDeactivate}
                      className="w-full"
                    >
                      Deactivate User
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleActivate}
                      className="w-full"
                    >
                      Activate User
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

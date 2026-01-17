'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(user.role)) {
          router.push('/forbidden');
        }
      }
    }
  }, [user, isLoading, router, requiredRole]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">⏳</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

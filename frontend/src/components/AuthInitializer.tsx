import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

const notFoundPathnames = ['/login', '/register'];

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { loadUser, user, isLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    const initializeAuth = async () => {
      const accessToken =
        typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

      if (accessToken) {
        try {
          await loadUser();
        } catch (error) {
          console.error('Failed to load user:', error);
        }
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, [loadUser]);

  React.useEffect(() => {
    if (isInitialized && !isLoading) {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

      if (!user && !notFoundPathnames.includes(pathname)) {
        router.push('/login');
      } else if (user && (pathname === '/login' || pathname === '/register')) {
        router.push('/dashboard');
      }
    }
  }, [isInitialized, isLoading, user, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;

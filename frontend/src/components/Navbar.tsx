import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleTheme, theme } = useThemeStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            Admin Panel
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                  <span className="text-sm">{user.firstName}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-lg shadow-lg hidden group-hover:block z-10">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-600 first:rounded-t-lg"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-600 last:rounded-b-lg border-t dark:border-slate-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

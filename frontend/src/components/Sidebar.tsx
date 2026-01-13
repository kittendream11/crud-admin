import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator' || isAdmin;

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    ...(isModerator ? [{ label: 'Users', href: '/admin/users', icon: '👥' }] : []),
    ...(isModerator ? [{ label: 'Articles', href: '/admin/content/articles', icon: '📄' }] : []),
    ...(isAdmin ? [{ label: 'Categories', href: '/admin/content/categories', icon: '📁' }] : []),
    ...(isAdmin ? [{ label: 'Audit Logs', href: '/admin/audit-logs', icon: '📋' }] : []),
    ...(isModerator ? [{ label: 'Profile', href: '/profile', icon: '👤' }] : []),
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 shadow h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary">Menu</h2>
      </div>
      <nav className="space-y-2 px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import { Metadata } from 'next';
import AuthInitializer from '@/components/AuthInitializer';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Admin CRUD System',
  description: 'A comprehensive admin panel for CRUD operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <AuthInitializer>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1 overflow-auto p-8">
                {children}
              </main>
            </div>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </AuthInitializer>
      </body>
    </html>
  );
}

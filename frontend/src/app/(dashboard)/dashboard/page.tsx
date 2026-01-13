'use client';

import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import userService from '@/services/user.service';
import contentService from '@/services/content.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

// Mock data for trends (in production, fetch from backend)
const userTrendData = [
  { date: 'Jan 1', users: 100 },
  { date: 'Jan 8', users: 120 },
  { date: 'Jan 15', users: 145 },
  { date: 'Jan 22', users: 180 },
  { date: 'Jan 29', users: 220 },
  { date: 'Feb 5', users: 265 },
  { date: 'Feb 12', users: 310 },
];

const articleTrendData = [
  { date: 'Jan 1', articles: 5 },
  { date: 'Jan 8', articles: 12 },
  { date: 'Jan 15', articles: 18 },
  { date: 'Jan 22', articles: 25 },
  { date: 'Jan 29', articles: 32 },
  { date: 'Feb 5', articles: 41 },
  { date: 'Feb 12', articles: 48 },
];

const rolePieData = [
  { name: 'Admin', value: 5 },
  { name: 'Moderator', value: 12 },
  { name: 'Viewer', value: 50 },
];

const articleStatusData = [
  { name: 'Draft', value: 15 },
  { name: 'Published', value: 28 },
  { name: 'Archived', value: 5 },
];

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  trend?: number;
  color: string;
}

function StatCard({ label, value, icon, trend, color }: StatCard) {
  return (
    <div className={`${color} rounded-lg shadow p-6 text-white`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
            </p>
          )}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: () => userService.getUsers({ page: 1, limit: 1 }),
  });

  const { data: articlesData, isLoading: articlesLoading } = useQuery({
    queryKey: ['dashboard-articles'],
    queryFn: () => contentService.getArticles({ page: 1, limit: 1 }),
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['dashboard-categories'],
    queryFn: () => contentService.getCategories({ page: 1, limit: 100 }),
  });

  const isLoading = usersLoading || articlesLoading || categoriesLoading;

  const totalUsers = usersData?.total || 0;
  const totalArticles = articlesData?.total || 0;
  const totalCategories = categoriesData?.total || 0;

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your admin dashboard
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Users"
            value={isLoading ? '...' : totalUsers}
            icon="👥"
            trend={12}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            label="Total Articles"
            value={isLoading ? '...' : totalArticles}
            icon="📄"
            trend={8}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            label="Categories"
            value={isLoading ? '...' : totalCategories}
            icon="📁"
            trend={-2}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            label="Active Sessions"
            value="24"
            icon="🔄"
            trend={5}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Growth Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Article Growth Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Article Growth Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={articleTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="articles" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Roles Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              User Roles Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rolePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {rolePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Article Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Article Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={articleStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {articleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/users" className="block">
            <Button variant="primary" className="w-full text-center py-3">
              ➕ Manage Users
            </Button>
          </Link>
          <Link href="/admin/content/articles/new" className="block">
            <Button variant="primary" className="w-full text-center py-3">
              ✍️ Create Article
            </Button>
          </Link>
          <Link href="/admin/content/categories" className="block">
            <Button variant="primary" className="w-full text-center py-3">
              📁 Manage Categories
            </Button>
          </Link>
          <Link href="/admin/audit-logs" className="block">
            <Button variant="secondary" className="w-full text-center py-3">
              📋 View Audit Logs
            </Button>
          </Link>
        </div>

        {/* System Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            System Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">API Status</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">✓ Healthy</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Database</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">✓ Connected</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cache</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">✓ Active</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Uptime</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">99.8%</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

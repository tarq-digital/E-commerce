import React from 'react';
import { cookies } from 'next/headers';
import { StatCardsWidget } from '../../../components/admin/dashboard/StatCardsWidget';
import { RecentOrdersWidget } from '../../../components/admin/dashboard/RecentOrdersWidget';
import { ActivityFeedWidget } from '../../../components/admin/dashboard/ActivityFeedWidget';

async function getDashboardData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
  const token = cookies().get('token')?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${apiUrl}/admin/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('Failed to fetch dashboard data', await res.text());
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    return null;
  }
}

export const metadata = {
  title: 'Admin Dashboard | Weebster',
};

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-bold">Failed to load dashboard data</h2>
        <p>Please check your connection or ensure you have the necessary permissions.</p>
      </div>
    );
  }

  const { stats, recent_orders, recent_activities } = data.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Here is what is happening with your store today.</p>
        </div>
        
        {/* Dashboard Metrics Filters (Placeholder) */}
        <select className="px-3 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-primary w-fit">
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="this_month">This Month</option>
          <option value="all_time">All Time</option>
        </select>
      </div>

      <StatCardsWidget stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentOrdersWidget orders={recent_orders} />
        </div>
        <div>
          <ActivityFeedWidget activities={recent_activities} />
        </div>
      </div>
    </div>
  );
}

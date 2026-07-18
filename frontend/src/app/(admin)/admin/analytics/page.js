'use client';

import React, { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  IndianRupee, 
  AlertTriangle,
  Package,
  Calendar,
  Filter
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Date Filters
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = getCookie('token');
      
      let query = '';
      if (dateRange === 'CUSTOM' && customStart && customEnd) {
          query = `?startDate=${new Date(customStart).toISOString()}&endDate=${new Date(customEnd).toISOString()}`;
      } else if (dateRange !== 'ALL_TIME' && dateRange !== 'CUSTOM') {
          // Mock calculation of dates based on dateRange (e.g., LAST_30_DAYS)
          const end = new Date();
          const start = new Date();
          if (dateRange === 'LAST_30_DAYS') start.setDate(start.getDate() - 30);
          if (dateRange === 'LAST_7_DAYS') start.setDate(start.getDate() - 7);
          query = `?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/analytics/dashboard${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if not custom, or if custom dates are fully set
    if (dateRange !== 'CUSTOM' || (customStart && customEnd)) {
        fetchDashboardData();
    }
  }, [dateRange, customStart, customEnd]);

  if (isLoading && !data) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading BI Dashboard...</div>;
  }

  const { kpis, top_products, inventory_alerts } = data || { kpis: {}, top_products: [], inventory_alerts: [] };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Header & Global Date Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Centralized Business Intelligence & Metrics Engine</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          <Filter size={16} className="text-gray-400 ml-2" />
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm font-medium border-none focus:ring-0 text-gray-700 bg-transparent cursor-pointer outline-none"
          >
            <option value="TODAY">Today</option>
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="LAST_30_DAYS">Last 30 Days</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="ALL_TIME">All Time</option>
            <option value="CUSTOM">Custom Range</option>
          </select>
          
          {dateRange === 'CUSTOM' && (
             <div className="flex items-center gap-2 px-2 border-l border-gray-200">
                <input type="date" value={customStart} onChange={(e)=>setCustomStart(e.target.value)} className="text-xs text-gray-600 border border-gray-200 rounded p-1"/>
                <span className="text-gray-400 text-xs">to</span>
                <input type="date" value={customEnd} onChange={(e)=>setCustomEnd(e.target.value)} className="text-xs text-gray-600 border border-gray-200 rounded p-1"/>
             </div>
          )}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">₹{Number(kpis.total_revenue || 0).toLocaleString()}</h3>
             </div>
             <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <IndianRupee size={20} />
             </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-emerald-600">
             <TrendingUp size={16} /> <span>+12.5%</span> <span className="text-gray-400 ml-1 text-xs">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">{kpis.total_orders || 0}</h3>
             </div>
             <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingCart size={20} />
             </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-blue-600">
             <TrendingUp size={16} /> <span>+5.2%</span> <span className="text-gray-400 ml-1 text-xs">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Average Order Value</p>
                <h3 className="text-2xl font-bold text-gray-900">₹{Number(kpis.average_order_value || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
             </div>
             <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp size={20} />
             </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-purple-600">
             <TrendingUp size={16} /> <span>+2.1%</span> <span className="text-gray-400 ml-1 text-xs">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-gray-500 mb-1">New Customers</p>
                <h3 className="text-2xl font-bold text-gray-900">{kpis.new_customers || 0}</h3>
             </div>
             <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                <Users size={20} />
             </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm text-orange-600">
             <TrendingUp size={16} /> <span>+18.4%</span> <span className="text-gray-400 ml-1 text-xs">vs last period</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Package size={18} className="text-primary" /> Top Performing Products
            </h3>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">SKU</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Units Sold</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {top_products?.length > 0 ? top_products.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{p.sku}</td>
                    <td className="px-5 py-3 text-sm text-gray-900 text-right">{p.units_sold}</td>
                    <td className="px-5 py-3 text-sm font-medium text-emerald-600 text-right">₹{Number(p.revenue).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-sm text-gray-400">No product sales in this period.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" /> Inventory Alerts
            </h3>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-[300px]">
             {inventory_alerts?.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {inventory_alerts.map((item, i) => (
                    <li key={i} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-xs text-gray-500">{item.sku}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        {item.available_stock} left
                      </span>
                    </li>
                  ))}
                </ul>
             ) : (
                <div className="p-8 text-center text-sm text-gray-400 flex flex-col items-center justify-center h-full gap-2">
                   <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-2">
                      <TrendingUp size={24} />
                   </div>
                   All inventory levels are healthy.
                </div>
             )}
          </div>
        </div>

      </div>

    </div>
  );
}

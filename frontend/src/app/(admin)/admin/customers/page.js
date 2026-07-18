'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { AdminTable } from '../../../../components/admin/ui/AdminTable';
import { AdminBadge } from '../../../../components/admin/ui/AdminBadge';
import { Users, UserCheck, UserX, TrendingUp, Search, Filter, Eye } from 'lucide-react';

export default function AdminCustomersDashboard() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchStats = async () => {
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/customers/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch CRM stats:', error);
    }
  };

  const fetchCustomers = async (page = 1, search = '', status = '') => {
    setIsLoading(true);
    try {
      const token = getCookie('token');
      const query = new URLSearchParams({ page, limit: 10 });
      if (search) query.append('search', search);
      if (status) query.append('status', status);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/customers?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setCustomers(data.data);
        setPagination(data.meta);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(1, searchQuery, statusFilter);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter]);

  const columns = [
    {
      header: 'Customer',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.first_name} {row.last_name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'account_status',
      render: (row) => {
        let variant = 'gray';
        if (row.account_status === 'ACTIVE') variant = 'green';
        if (row.account_status === 'BLOCKED' || row.account_status === 'DEACTIVATED') variant = 'red';
        if (row.account_status === 'SUSPENDED') variant = 'yellow';
        return <AdminBadge variant={variant}>{row.account_status}</AdminBadge>;
      }
    },
    {
      header: 'Tags',
      accessor: 'tags',
      render: (row) => (
        <div className="flex gap-1 flex-wrap max-w-[150px]">
          {row.tags ? row.tags.split(',').map((tag, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 truncate max-w-full">
              {tag}
            </span>
          )) : <span className="text-gray-400 text-xs">-</span>}
        </div>
      )
    },
    {
      header: 'Orders',
      accessor: 'order_count',
      render: (row) => <span className="font-medium text-gray-900">{row.order_count || 0}</span>
    },
    {
      header: 'Lifetime Value',
      accessor: 'lifetime_value',
      render: (row) => (
        <span className="font-semibold text-gray-900">
          ₹{Number(row.lifetime_value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      )
    },
    {
      header: 'Joined',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {new Date(row.created_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          })}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/customers/${row.id}`}>
            <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="View CRM Profile">
              <Eye size={16} />
            </button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer CRM</h1>
        <p className="text-gray-500 text-sm mt-1">Manage customer intelligence, relationships, and advanced segmentation.</p>
      </div>

      {/* KPI Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Profiles</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.active}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <UserX size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Blocked Profiles</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.blocked}</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. LTV</p>
              <h3 className="text-2xl font-bold text-gray-900">
                ₹{Number(stats.avg_ltv).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search name, email, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-gray-400 shrink-0" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>
        </div>
      </div>

      <AdminTable 
        columns={columns}
        data={customers}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => fetchCustomers(page, searchQuery, statusFilter)}
        bulkActions={true}
      />
    </div>
  );
}

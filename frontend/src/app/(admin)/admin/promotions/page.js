'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { AdminTable } from '../../../../components/admin/ui/AdminTable';
import { AdminBadge } from '../../../../components/admin/ui/AdminBadge';
import { Tag, Plus, Settings, TrendingDown, Percent, Calendar } from 'lucide-react';

export default function PromotionsDashboard() {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });

  const fetchPromotions = async (page = 1) => {
    setIsLoading(true);
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/promotions?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setPromotions(data.data);
        setPagination(data.meta);
      }
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const columns = [
    {
      header: 'Promotion Rule',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.is_automatic ? 'Automatic Discount' : 'Coupon Code'}</p>
        </div>
      )
    },
    {
      header: 'Code',
      accessor: 'coupon_code',
      render: (row) => (
        row.is_automatic ? (
          <span className="text-gray-400 text-sm italic">Auto</span>
        ) : (
          <span className="font-mono text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
            {row.coupon_code}
          </span>
        )
      )
    },
    {
      header: 'Value',
      accessor: 'discount_value',
      render: (row) => (
        <span className="font-medium text-gray-900">
          {row.type === 'PERCENTAGE' ? `${row.discount_value}%` : `₹${row.discount_value}`}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <AdminBadge variant={row.status === 'ACTIVE' ? 'green' : row.status === 'SCHEDULED' ? 'blue' : 'gray'}>
          {row.status}
        </AdminBadge>
      )
    },
    {
      header: 'Usage',
      accessor: 'usage_count',
      render: (row) => (
        row.is_automatic ? (
          <span className="text-gray-400 text-sm">-</span>
        ) : (
          <span className="text-sm font-medium text-gray-900">
            {row.usage_count || 0} {row.usage_limit ? `/ ${row.usage_limit}` : ''}
          </span>
        )
      )
    },
    {
      header: 'Validity',
      accessor: 'validity',
      render: (row) => (
        <div className="text-xs text-gray-500">
          <p>{row.start_date ? new Date(row.start_date).toLocaleDateString() : 'Immediate'}</p>
          <p>{row.end_date ? `till ${new Date(row.end_date).toLocaleDateString()}` : 'No Expiry'}</p>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Manage Rule">
          <Settings size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pricing & Promotions</h1>
          <p className="text-gray-500 text-sm mt-1">Manage discount rules, coupons, and pricing priority.</p>
        </div>
        <Link href="/admin/promotions/create">
          <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
            <Plus size={18} />
            Create Promotion
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Coupons</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {promotions.filter(p => !p.is_automatic && p.status === 'ACTIVE').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Percent size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Auto Discounts</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {promotions.filter(p => p.is_automatic && p.status === 'ACTIVE').length}
            </h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Scheduled Rules</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {promotions.filter(p => p.status === 'SCHEDULED').length}
            </h3>
          </div>
        </div>
      </div>

      <AdminTable 
        columns={columns}
        data={promotions}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => fetchPromotions(page)}
      />
    </div>
  );
}

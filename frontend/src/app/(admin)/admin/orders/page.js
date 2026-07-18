'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { AdminTable } from '../../../../components/admin/ui/AdminTable';
import { AdminBadge } from '../../../../components/admin/ui/AdminBadge';
import { Eye, ShieldAlert } from 'lucide-react';

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async (page = 1, search = '') => {
    setIsLoading(true);
    try {
      const token = getCookie('token');
      const query = new URLSearchParams({ page, limit: 10 });
      if (search) query.append('search', search);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/orders?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setOrders(data.data);
        setPagination(data.meta);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(1, searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      render: (row) => (
        <div className="font-medium text-primary">
          <Link href={`/admin/orders/${row.id}`} className="hover:underline">
            #{row.id.substring(0, 8).toUpperCase()}
          </Link>
          {row.is_on_hold && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              ON HOLD
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Date',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-gray-600">
          {new Date(row.created_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })}
        </span>
      )
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.first_name || 'Guest'} {row.last_name || ''}</p>
          <p className="text-xs text-gray-500">{row.contact_email}</p>
        </div>
      )
    },
    {
      header: 'Total',
      accessor: 'grand_total',
      render: (row) => (
        <span className="font-medium">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: row.currency || 'INR' }).format(row.grand_total)}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        let variant = 'gray';
        const s = row.status;
        if (s === 'ORDER_CREATED') variant = 'yellow';
        else if (s === 'CONFIRMED' || s === 'PACKED' || s === 'READY_TO_SHIP') variant = 'blue';
        else if (s === 'SHIPPED' || s === 'OUT_FOR_DELIVERY') variant = 'purple';
        else if (s === 'DELIVERED') variant = 'green';
        else if (s === 'CANCELLED' || s === 'RETURN_REQUESTED' || s === 'RETURN_APPROVED' || s === 'RETURNED' || s === 'REFUND_PENDING' || s === 'REFUNDED') variant = 'red';
        
        return <AdminBadge variant={variant}>{s.replace(/_/g, ' ')}</AdminBadge>;
      }
    },
    {
      header: 'Risk',
      accessor: 'risk_score',
      render: (row) => (
        <div className="flex items-center gap-1">
          {row.risk_score > 70 ? (
            <ShieldAlert size={16} className="text-red-500" />
          ) : (
            <span className="text-green-500 font-medium text-xs">Low</span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/orders/${row.id}`}>
            <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="View Order">
              <Eye size={16} />
            </button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and fulfill customer orders.</p>
        </div>
      </div>

      <AdminTable 
        columns={columns}
        data={orders}
        isLoading={isLoading}
        onSearch={setSearchQuery}
        pagination={pagination}
        onPageChange={(page) => fetchOrders(page, searchQuery)}
        bulkActions={true}
      />
    </div>
  );
}

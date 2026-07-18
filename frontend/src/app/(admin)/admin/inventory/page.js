'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCookie } from 'cookies-next';
import { AdminTable } from '../../../../components/admin/ui/AdminTable';
import { AdminBadge } from '../../../../components/admin/ui/AdminBadge';
import { AdminButton } from '../../../../components/admin/ui/AdminButton';
import { Eye, AlertTriangle } from 'lucide-react';

export default function AdminInventoryDashboard() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const fetchInventory = async (page = 1, search = '', lowStock = false) => {
    setIsLoading(true);
    try {
      const token = getCookie('token');
      const query = new URLSearchParams({ page, limit: 10 });
      if (search) query.append('search', search);
      if (lowStock) query.append('low_stock', 'true');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/inventory?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setInventory(data.data);
        setPagination(data.meta);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchInventory(1, searchQuery, showLowStockOnly);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, showLowStockOnly]);

  const columns = [
    {
      header: 'Product',
      accessor: 'product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden relative shrink-0 bg-gray-50">
            {row.image_url ? (
              <Image src={row.image_url} alt={row.product_name} fill className="object-cover" sizes="40px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.product_name}</p>
            <p className="text-xs text-gray-500">SKU: {row.sku}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Warehouse',
      accessor: 'warehouse_name',
      render: (row) => (
        <span className="text-sm text-gray-600">{row.warehouse_name || 'Main Warehouse'}</span>
      )
    },
    {
      header: 'Available',
      accessor: 'available_stock',
      render: (row) => {
        const isLow = row.available_stock <= row.low_stock_threshold;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
              {row.available_stock}
            </span>
            {isLow && <AlertTriangle size={14} className="text-red-500" title="Low Stock" />}
          </div>
        );
      }
    },
    {
      header: 'Reserved',
      accessor: 'reserved_stock',
      render: (row) => (
        <span className="text-gray-500 font-medium">{row.reserved_stock}</span>
      )
    },
    {
      header: 'Last Updated',
      accessor: 'updated_at',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {new Date(row.updated_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
          })}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/inventory/${row.variant_id}`}>
            <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Manage Stock">
              <Eye size={16} />
            </button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage stock levels, reservations, and multi-warehouse allocation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              showLowStockOnly 
                ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {showLowStockOnly ? 'Clear Alerts' : 'Show Low Stock Alerts'}
          </button>
        </div>
      </div>

      <AdminTable 
        columns={columns}
        data={inventory}
        isLoading={isLoading}
        onSearch={setSearchQuery}
        pagination={pagination}
        onPageChange={(page) => fetchInventory(page, searchQuery, showLowStockOnly)}
        bulkActions={true}
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { AdminTable } from '../../../../components/admin/ui/AdminTable';
import { AdminButton } from '../../../../components/admin/ui/AdminButton';
import { AdminBadge } from '../../../../components/admin/ui/AdminBadge';
import { Plus, Edit, Archive, Copy, MoreVertical } from 'lucide-react';
import Image from 'next/image';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async (page = 1, search = '') => {
    setIsLoading(true);
    try {
      const token = getCookie('token');
      const query = new URLSearchParams({ page, limit: 10 });
      if (search) query.append('search', search);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/products?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.data);
        setPagination(data.meta);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(1, searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
            {row.primary_image_url ? (
              <Image src={row.primary_image_url} alt={row.name} fill className="object-cover" sizes="40px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">SKU: {row.sku}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        let variant = 'gray';
        if (row.status === 'PUBLISHED') variant = 'green';
        if (row.status === 'DRAFT') variant = 'yellow';
        if (row.status === 'ARCHIVED') variant = 'red';
        if (row.status === 'READY_FOR_REVIEW') variant = 'blue';
        return <AdminBadge variant={variant}>{row.status}</AdminBadge>;
      }
    },
    {
      header: 'Inventory',
      accessor: 'inventory',
      render: (row) => (
        <span className="text-gray-600">
          {/* Mocked for now, needs inventory aggregation in the backend */}
          {row.stock_quantity || 0} in stock
        </span>
      )
    },
    {
      header: 'Price',
      accessor: 'base_price',
      render: (row) => (
        <span className="font-medium">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(row.base_price)}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/products/${row.slug}`}>
            <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Edit">
              <Edit size={16} />
            </button>
          </Link>
          <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Duplicate">
            <Copy size={16} />
          </button>
          <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Archive">
            <Archive size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your catalog, pricing, and inventory.</p>
        </div>
        
        <Link href="/admin/products/new">
          <AdminButton icon={<Plus size={18} />}>
            Add Product
          </AdminButton>
        </Link>
      </div>

      <AdminTable 
        columns={columns}
        data={products}
        isLoading={isLoading}
        onSearch={setSearchQuery}
        pagination={pagination}
        onPageChange={(page) => fetchProducts(page, searchQuery)}
        bulkActions={true}
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { AdminTable } from '../../../../components/admin/ui/AdminTable';
import { AdminButton } from '../../../../components/admin/ui/AdminButton';
import { AdminBadge } from '../../../../components/admin/ui/AdminBadge';
import { Plus, Edit, Archive } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategories = async (search = '') => {
    setIsLoading(true);
    try {
      const token = getCookie('token');
      const query = new URLSearchParams();
      if (search) query.append('search', search);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/categories?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">/{row.slug}</p>
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
        return <AdminBadge variant={variant}>{row.status}</AdminBadge>;
      }
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Edit">
            <Edit size={16} />
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
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Organize your products into collections.</p>
        </div>
        
        <AdminButton icon={<Plus size={18} />}>
          Add Category
        </AdminButton>
      </div>

      <AdminTable 
        columns={columns}
        data={categories}
        isLoading={isLoading}
        onSearch={setSearchQuery}
        bulkActions={false}
      />
    </div>
  );
}

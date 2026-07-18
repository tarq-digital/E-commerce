'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageX, Search, Filter } from 'lucide-react';
import { OrderCard } from './OrderCard';

export function OrderList({ orders, meta }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) params.set('search', searchTerm);
    else params.delete('search');
    
    // Reset to page 1 on search
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('status', value);
    else params.delete('status');
    
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage);
    router.push(`?${params.toString()}`);
  };

  const totalPages = Math.ceil((meta?.total || 0) / (meta?.limit || 10));
  const currentPage = meta?.page || 1;

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search by Order ID, Product Name, SKU..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-500" />
          <select 
            className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary bg-white w-full md:w-auto"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Order List */}
      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <PackageX size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Orders Found</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md">
            {searchTerm || statusFilter 
              ? "We couldn't find any orders matching your search or filters." 
              : "You haven't placed any orders yet. Start shopping to see your orders here."}
          </p>
          {(searchTerm || statusFilter) ? (
            <button 
              onClick={() => { setSearchTerm(''); setStatusFilter(''); router.push('?'); }}
              className="text-primary hover:underline text-sm font-medium"
            >
              Clear Filters
            </button>
          ) : (
            <Link href="/shop" className="btn-primary">
              Start Shopping
            </Link>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button 
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

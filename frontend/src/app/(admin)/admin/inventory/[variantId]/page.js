'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { ArrowLeft, Package, History, Settings2, ShieldCheck, MapPin } from 'lucide-react';
import { AdminCard } from '../../../../../components/admin/ui/AdminCard';
import { AdminButton } from '../../../../../components/admin/ui/AdminButton';
import { AdminBadge } from '../../../../../components/admin/ui/AdminBadge';
import { StockAdjustmentModal } from '../../../../../components/admin/inventory/StockAdjustmentModal';

export default function InventoryDetailPage() {
  const { variantId } = useParams();
  const searchParams = useSearchParams();
  const warehouseId = searchParams.get('warehouse_id') || '1';
  
  const [inventory, setInventory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const fetchInventory = async () => {
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/inventory/${variantId}?warehouse_id=${warehouseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [variantId, warehouseId]);

  const handleAdjustStock = async ({ type, quantity, reason }) => {
    setIsAdjusting(true);
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/inventory/${variantId}/adjust`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ warehouseId, type, quantity, reason })
      });
      const data = await res.json();
      if (data.success) {
        setInventory(data.data);
        setIsModalOpen(false);
      } else {
        alert(data.message || 'Failed to adjust stock');
      }
    } catch (error) {
      console.error('Failed to adjust stock:', error);
      alert('An error occurred during adjustment.');
    } finally {
      setIsAdjusting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading inventory data...</div>;
  if (!inventory) return <div className="p-8 text-center text-red-500">Inventory record not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/inventory">
            <button className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{inventory.product_name}</h1>
            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
              SKU: {inventory.sku} 
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <MapPin size={12} className="text-gray-400" />
              {inventory.warehouse_name}
            </p>
          </div>
        </div>
        <AdminButton onClick={() => setIsModalOpen(true)} icon={<Settings2 size={16} />}>
          Adjust Stock
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI Cards */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Available Stock</p>
              <h3 className={`text-2xl font-bold ${inventory.available_stock <= inventory.low_stock_threshold ? 'text-red-600' : 'text-gray-900'}`}>
                {inventory.available_stock}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Reserved (Orders)</p>
              <h3 className="text-2xl font-bold text-gray-900">{inventory.reserved_stock}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <History size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Physical Stock</p>
              <h3 className="text-2xl font-bold text-gray-900">{inventory.available_stock + inventory.reserved_stock}</h3>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="md:col-span-3">
          <AdminCard title="Inventory Transactions">
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="py-3 font-semibold">Date</th>
                    <th className="py-3 font-semibold">Type</th>
                    <th className="py-3 font-semibold">Qty</th>
                    <th className="py-3 font-semibold">Reason / Reference</th>
                    <th className="py-3 font-semibold">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventory.transactions?.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">No transactions recorded yet.</td>
                    </tr>
                  )}
                  {inventory.transactions?.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50">
                      <td className="py-4 whitespace-nowrap text-gray-500">
                        {new Date(tx.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="py-4">
                        <AdminBadge variant={
                          tx.type === 'IN' ? 'green' : 
                          tx.type === 'OUT' ? 'red' : 
                          tx.type === 'ADJUSTMENT' ? 'yellow' : 'blue'
                        }>
                          {tx.type}
                        </AdminBadge>
                      </td>
                      <td className={`py-4 font-semibold ${tx.type === 'IN' || tx.type === 'RELEASED' ? 'text-green-600' : tx.type === 'OUT' || tx.type === 'RESERVED' ? 'text-red-600' : 'text-gray-900'}`}>
                        {tx.type === 'IN' || tx.type === 'RELEASED' ? '+' : tx.type === 'OUT' || tx.type === 'RESERVED' ? '-' : ''}{tx.quantity}
                      </td>
                      <td className="py-4">
                        <p className="text-gray-900">{tx.reason}</p>
                        {tx.reference_id && <p className="text-xs text-gray-500 font-mono mt-0.5">Ref: {tx.reference_id}</p>}
                      </td>
                      <td className="py-4 text-gray-600">
                        {tx.first_name ? `${tx.first_name} ${tx.last_name || ''}` : 'System'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>

      </div>

      <StockAdjustmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdjust={handleAdjustStock}
        currentStock={inventory.available_stock}
        isLoading={isAdjusting}
      />
    </div>
  );
}

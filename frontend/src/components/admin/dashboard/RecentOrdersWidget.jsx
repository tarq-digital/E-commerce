import React from 'react';
import Link from 'next/link';
import { AdminCard } from '../ui/AdminCard';
import { AdminBadge } from '../ui/AdminBadge';
import { AdminButton } from '../ui/AdminButton';

export function RecentOrdersWidget({ orders = [] }) {
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'PENDING': return 'yellow';
      case 'PAID': return 'green';
      case 'PROCESSING': 
      case 'CONFIRMED': return 'blue';
      case 'SHIPPED': return 'purple';
      case 'DELIVERED': return 'green';
      case 'CANCELLED': return 'red';
      default: return 'gray';
    }
  };

  return (
    <AdminCard 
      title="Recent Orders" 
      action={
        <Link href="/admin/orders">
          <AdminButton variant="ghost" size="sm">View All</AdminButton>
        </Link>
      }
      className="!p-0"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 uppercase">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-primary hover:underline">
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="line-clamp-1 max-w-[200px]" title={order.item_name}>
                      {order.item_name || 'Items'} 
                      {order.item_count > 1 && <span className="text-gray-400 text-xs ml-1">(+{order.item_count - 1})</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency || 'INR' }).format(order.grand_total)}
                  </td>
                  <td className="px-6 py-4">
                    <AdminBadge variant={getBadgeVariant(order.status)}>
                      {order.status}
                    </AdminBadge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}

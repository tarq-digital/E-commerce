import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';
import { OrderStatusBadge } from './OrderStatusBadge';

export function OrderCard({ order }) {
  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: order.currency || 'INR'
  }).format(order.grand_total);

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors shadow-sm">
      <div className="p-4 bg-gray-50/50 border-b flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <p className="text-gray-500 mb-0.5">Order Placed</p>
            <p className="font-medium text-gray-900">{formattedDate}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Total Amount</p>
            <p className="font-medium text-gray-900">{formattedTotal}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">Order ID</p>
            <p className="font-medium text-gray-900 uppercase">#{order.id.slice(0,8)}</p>
          </div>
        </div>
        
        <Link 
          href={`/account/orders/${order.id}`}
          className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
        >
          View Details <ChevronRight size={16} />
        </Link>
      </div>
      
      <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
            <Package className="text-gray-400" size={24} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 line-clamp-1">
              {order.first_item_name || 'Multiple Items'}
            </h4>
            {order.item_count > 1 && (
              <p className="text-sm text-gray-500 mt-0.5">
                + {order.item_count - 1} other item{order.item_count - 1 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-2 w-full sm:w-auto">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>
    </div>
  );
}

import { useMemo } from 'react';

export function OrderStatusBadge({ status }) {
  const config = useMemo(() => {
    switch (status) {
      case 'PENDING':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Payment' };
      case 'PAID':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid' };
      case 'PROCESSING':
      case 'CONFIRMED':
      case 'PACKED':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' };
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Shipped' };
      case 'DELIVERED':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Delivered' };
      case 'CANCELLED':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' };
      case 'REFUNDED':
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Refunded' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    }
  }, [status]);

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

import React, { useState } from 'react';
import { AdminSelect } from '../ui/AdminSelect';
import { AdminButton } from '../ui/AdminButton';
import { Check } from 'lucide-react';

const STATUS_OPTIONS = [
  { label: 'Order Created', value: 'ORDER_CREATED' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Packed', value: 'PACKED' },
  { label: 'Ready to Ship', value: 'READY_TO_SHIP' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Return Requested', value: 'RETURN_REQUESTED' },
  { label: 'Return Approved', value: 'RETURN_APPROVED' },
  { label: 'Returned', value: 'RETURNED' },
  { label: 'Refund Pending', value: 'REFUND_PENDING' },
  { label: 'Refunded', value: 'REFUNDED' }
];

export function StatusSelector({ currentStatus, onUpdateStatus }) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) return;
    setIsUpdating(true);
    await onUpdateStatus(selectedStatus);
    setIsUpdating(false);
  };

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <AdminSelect 
          label="Update Status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          options={STATUS_OPTIONS}
        />
      </div>
      <AdminButton 
        onClick={handleUpdate}
        disabled={selectedStatus === currentStatus}
        isLoading={isUpdating}
        icon={<Check size={16} />}
      >
        Update
      </AdminButton>
    </div>
  );
}

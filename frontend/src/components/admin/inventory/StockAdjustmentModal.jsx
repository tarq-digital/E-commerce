import React, { useState } from 'react';
import { AdminModal } from '../ui/AdminModal';
import { AdminSelect } from '../ui/AdminSelect';
import { AdminInput } from '../ui/AdminInput';

export function StockAdjustmentModal({ isOpen, onClose, onAdjust, currentStock, isLoading }) {
  const [type, setType] = useState('IN');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }
    if (type === 'OUT' && quantity > currentStock) {
      alert("Cannot deduct more than available stock.");
      return;
    }
    if (!reason.trim()) {
      alert("Please provide a reason for the adjustment.");
      return;
    }
    await onAdjust({ type, quantity: Number(quantity), reason });
    setQuantity(1);
    setReason('');
  };

  const TYPE_OPTIONS = [
    { label: 'Add Stock (IN)', value: 'IN' },
    { label: 'Deduct Stock (OUT)', value: 'OUT' },
    { label: 'Set Absolute Stock (ADJUSTMENT)', value: 'ADJUSTMENT' },
  ];

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Inventory"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
          <p className="text-sm text-gray-500">Current Available Stock</p>
          <p className="text-2xl font-bold text-gray-900">{currentStock}</p>
        </div>

        <AdminSelect 
          label="Adjustment Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={TYPE_OPTIONS}
          required
        />

        <AdminInput
          label={type === 'ADJUSTMENT' ? "New Stock Level" : "Quantity"}
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Reason / Note
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
            rows="3"
            placeholder="e.g. Restock from supplier, Damaged goods, Manual recount"
            required
          />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Confirm Adjustment'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

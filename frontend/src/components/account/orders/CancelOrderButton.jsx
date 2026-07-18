'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, Loader2 } from 'lucide-react';
import { getCookie } from 'cookies-next';

export function CancelOrderButton({ orderId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
      const token = getCookie('token');
      
      const res = await fetch(`${apiUrl}/store/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to cancel order');
      }

      setIsOpen(false);
      router.refresh(); // Refresh page to get new status
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn-secondary text-sm flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
      >
        <XCircle size={16} /> Cancel Order
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-2">Cancel Order</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Are you sure you want to cancel Order #{orderId.slice(0,8).toUpperCase()}? This action cannot be undone, and a refund will be initiated if you have already paid.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Keep Order
              </button>
              <button 
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

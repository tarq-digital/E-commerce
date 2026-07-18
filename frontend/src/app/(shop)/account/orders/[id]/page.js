import { OrderTimeline } from '../../../../../components/account/orders/OrderTimeline';
import { OrderItems } from '../../../../../components/account/orders/OrderItems';
import { OrderSummary } from '../../../../../components/account/orders/OrderSummary';
import { CancelOrderButton } from '../../../../../components/account/orders/CancelOrderButton';
import { OrderStatusBadge } from '../../../../../components/account/orders/OrderStatusBadge';
import { ErrorState } from '../../../../../components/ui/ErrorState/ErrorState';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ArrowLeft, Download, RefreshCw, HelpCircle } from 'lucide-react';

async function getOrderDetails(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
  const token = cookies().get('token')?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${apiUrl}/store/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch order');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Order Details Fetch Error:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  return {
    title: `Order #${params.id} | Weebster`,
  };
}

export default async function OrderDetailsPage({ params }) {
  const order = await getOrderDetails(params.id);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <ErrorState 
          title="Order Not Found" 
          message="We couldn't find this order. It may have been removed or you don't have permission to view it."
        />
        <div className="flex justify-center mt-6">
          <Link href="/account/orders" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const isCancellable = ['PENDING', 'PAID', 'PROCESSING', 'CONFIRMED'].includes(order.status);
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/account/orders" className="text-gray-500 hover:text-primary flex items-center gap-2 text-sm w-fit mb-4">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              Order #{order.id.slice(0,8).toUpperCase()}
              <OrderStatusBadge status={order.status} />
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          
          <div className="flex gap-3">
            {isCancellable && (
              <CancelOrderButton orderId={order.id} />
            )}
            {isDelivered && (
              <button disabled className="btn-secondary text-sm flex items-center gap-2 opacity-60 cursor-not-allowed">
                <RefreshCw size={16} /> Return Item
              </button>
            )}
            <button disabled className="btn-secondary text-sm flex items-center gap-2 opacity-60 cursor-not-allowed">
              <Download size={16} /> Invoice
            </button>
            <button disabled className="btn-secondary text-sm flex items-center gap-2 opacity-60 cursor-not-allowed">
              <HelpCircle size={16} /> Support
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Order Items</h2>
            <OrderItems items={order.items} currency={order.currency} />
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Delivery Details</h2>
            {order.shipping_address ? (
              <div className="text-gray-700 text-sm">
                <p className="font-medium text-gray-900">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                <p className="mt-2 text-gray-500">Phone: {order.shipping_address.phone}</p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No delivery address found.</p>
            )}
          </div>
        </div>

        {/* Right Column - Timeline & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Order Tracking</h2>
            <OrderTimeline timeline={order.timeline || []} currentStatus={order.status} />
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Payment Summary</h2>
            <OrderSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}

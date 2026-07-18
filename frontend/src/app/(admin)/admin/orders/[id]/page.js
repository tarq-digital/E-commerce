'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { ArrowLeft, MapPin, CreditCard, Package, User, Printer, ShieldAlert } from 'lucide-react';
import { AdminCard } from '../../../../../components/admin/ui/AdminCard';
import { AdminButton } from '../../../../../components/admin/ui/AdminButton';
import { AdminBadge } from '../../../../../components/admin/ui/AdminBadge';
import { StatusSelector } from '../../../../../components/admin/orders/StatusSelector';
import { TimelinePanel } from '../../../../../components/admin/orders/TimelinePanel';

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('An error occurred while updating status.');
    }
  };

  const handleAddNote = async (notes) => {
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/orders/${id}/timeline`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ notes })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleToggleHold = async (isOnHold) => {
    const reason = isOnHold ? prompt("Enter reason for holding this order:") : '';
    if (isOnHold && reason === null) return; // User cancelled

    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/orders/${id}/hold`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ is_on_hold: isOnHold, hold_reason: reason })
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Failed to toggle hold status:', error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-red-500">Order not found</div>;
  }

  const shipping = order.shipping_address_json || {};
  const billing = order.billing_address_json || {};
  const isHighRisk = order.risk_score > 70;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <button className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">#{order.id.substring(0, 8).toUpperCase()}</h1>
              <AdminBadge variant={order.status === 'DELIVERED' ? 'green' : (order.status === 'CANCELLED' ? 'red' : 'blue')}>
                {order.status.replace(/_/g, ' ')}
              </AdminBadge>
              {order.is_on_hold && (
                <AdminBadge variant="red">ON HOLD</AdminBadge>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Placed on {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AdminButton variant="secondary" icon={<Printer size={16} />}>
            Print Invoice
          </AdminButton>
          {order.is_on_hold ? (
            <AdminButton onClick={() => handleToggleHold(false)} className="bg-green-600 hover:bg-green-700">
              Resume Order
            </AdminButton>
          ) : (
            <AdminButton variant="secondary" onClick={() => handleToggleHold(true)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              Hold Order
            </AdminButton>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column - Main Details */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Items */}
          <AdminCard title={`Order Items (${order.items?.length || 0})`}>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="py-3 font-semibold">Product</th>
                    <th className="py-3 font-semibold text-center">Qty</th>
                    <th className="py-3 font-semibold text-right">Price</th>
                    <th className="py-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4">
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-right">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(item.price)}
                      </td>
                      <td className="py-4 text-right font-medium">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-gray-100 bg-gray-50/50">
                  <tr>
                    <td colSpan="3" className="py-3 text-right text-gray-500">Subtotal</td>
                    <td className="py-3 text-right font-medium">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(order.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="py-3 text-right text-gray-500">Shipping</td>
                    <td className="py-3 text-right font-medium">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(order.shipping_total)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="py-3 text-right text-gray-500">Tax</td>
                    <td className="py-3 text-right font-medium">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(order.tax_total)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="py-4 text-right font-bold text-gray-900">Grand Total</td>
                    <td className="py-4 text-right font-bold text-gray-900 text-lg">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: order.currency }).format(order.grand_total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </AdminCard>

          {/* Timeline */}
          <AdminCard title="Order Timeline">
            <TimelinePanel events={order.timeline} onAddNote={handleAddNote} />
          </AdminCard>

        </div>

        {/* Right Column - Sidebar */}
        <div className="w-full lg:w-[340px] shrink-0 space-y-6">
          
          <AdminCard title="Fulfillment Status">
            <StatusSelector currentStatus={order.status} onUpdateStatus={handleUpdateStatus} />
          </AdminCard>

          <AdminCard title="Customer Details">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{order.first_name || 'Guest'} {order.last_name || ''}</p>
                  <p className="text-gray-500">{order.contact_email}</p>
                  <p className="text-gray-500">{order.contact_phone}</p>
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Shipping Address">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div className="text-gray-600">
                  <p className="font-medium text-gray-900">{shipping.first_name} {shipping.last_name}</p>
                  <p>{shipping.address_line1}</p>
                  {shipping.address_line2 && <p>{shipping.address_line2}</p>}
                  <p>{shipping.city}, {shipping.state} {shipping.postal_code}</p>
                  <p>{shipping.country}</p>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Fraud Analysis Placeholder */}
          <AdminCard title="Fraud Analysis">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-2">
                  <ShieldAlert size={14} className={isHighRisk ? "text-red-500" : "text-green-500"} />
                  Risk Score
                </span>
                <span className={`font-semibold ${isHighRisk ? 'text-red-600' : 'text-green-600'}`}>
                  {order.risk_score} / 100
                </span>
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                {isHighRisk ? "This order requires manual review due to a high risk score." : "This order exhibits standard behavioral patterns."}
              </p>
            </div>
          </AdminCard>

        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { ArrowLeft, User, Mail, ShieldAlert, History, MapPin, Package, StickyNote, Activity, RefreshCcw } from 'lucide-react';
import { AdminCard } from '../../../../../components/admin/ui/AdminCard';
import { AdminBadge } from '../../../../../components/admin/ui/AdminBadge';
import { AdminButton } from '../../../../../components/admin/ui/AdminButton';

export default function CustomerProfilePage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');
  const [newNote, setNewNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const fetchCustomer = async () => {
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCustomer(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch CRM profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/customers/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setCustomer({ ...customer, account_status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsSubmittingNote(true);
    try {
      const token = getCookie('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/admin/customers/${id}/notes`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ content: newNote, type: 'GENERAL' })
      });
      const data = await res.json();
      if (data.success) {
        setNewNote('');
        fetchCustomer(); // Refetch to get updated notes and timeline
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading CRM profile...</div>;
  if (!customer) return <div className="p-8 text-center text-red-500">Customer not found.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      
      {/* 360° Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <Link href="/admin/customers">
              <button className="p-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors mt-1">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <User size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{customer.first_name} {customer.last_name}</h1>
                <AdminBadge variant={customer.account_status === 'ACTIVE' ? 'green' : 'red'}>
                  {customer.account_status}
                </AdminBadge>
                {customer.tags?.map((tag) => (
                  <AdminBadge key={tag.id} variant={tag.color || 'gray'}>{tag.name}</AdminBadge>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Mail size={14} /> {customer.email}</span>
                <span className="flex items-center gap-1.5"><ShieldAlert size={14} /> Trust Score: {customer.trust_score}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <select 
                value={customer.account_status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium bg-white"
             >
                <option value="ACTIVE">Mark Active</option>
                <option value="BLOCKED">Block User</option>
                <option value="SUSPENDED">Suspend User</option>
                <option value="DEACTIVATED">Deactivate</option>
             </select>
          </div>
        </div>

        {/* Activity Summary Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 bg-gray-50">
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Lifetime Value</p>
            <p className="text-xl font-bold text-gray-900">₹{Number(customer.analytics?.lifetime_value || 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Avg Order Value</p>
            <p className="text-xl font-bold text-gray-900">₹{Number(customer.analytics?.average_order_value || 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Orders</p>
            <p className="text-xl font-bold text-gray-900">{customer.analytics?.total_orders || 0}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Last Login</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {customer.last_login_at ? new Date(customer.last_login_at).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Modular 360° View Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'timeline', label: 'Timeline & Notes', icon: <History size={16} /> },
            { id: 'orders', label: 'Recent Orders', icon: <Package size={16} /> },
            { id: 'addresses', label: 'Address Book', icon: <MapPin size={16} /> },
            { id: 'marketing', label: 'Marketing & Loyalty (Prep)', icon: <Activity size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'timeline' && (
            <AdminCard title="Customer Timeline">
              <div className="space-y-6">
                {customer.timeline?.map((event, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {idx !== customer.timeline.length - 1 && (
                      <div className="absolute top-8 bottom-[-24px] left-5 w-px bg-gray-200"></div>
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      event.type === 'REGISTRATION' ? 'bg-green-100 text-green-600' :
                      event.type === 'LOGIN' ? 'bg-blue-100 text-blue-600' :
                      event.type === 'ORDER' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {event.type === 'NOTE' ? <StickyNote size={18} /> : <Activity size={18} />}
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium text-gray-900">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          )}

          {activeTab === 'orders' && (
            <AdminCard title="Order History">
               <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="py-3 font-semibold">Order</th>
                      <th className="py-3 font-semibold">Date</th>
                      <th className="py-3 font-semibold">Status</th>
                      <th className="py-3 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customer.recent_orders?.length === 0 && (
                      <tr><td colSpan="4" className="py-6 text-center text-gray-500">No orders found.</td></tr>
                    )}
                    {customer.recent_orders?.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50/50">
                        <td className="py-4 font-medium text-gray-900">
                          <Link href={`/admin/orders/${order.id}`} className="hover:text-primary transition-colors">
                            #{order.order_number}
                          </Link>
                        </td>
                        <td className="py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="py-4"><AdminBadge>{order.status}</AdminBadge></td>
                        <td className="py-4 font-semibold text-right">₹{Number(order.grand_total).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AdminCard>
          )}

          {activeTab === 'addresses' && (
             <AdminCard title="Address Book">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {customer.addresses?.length === 0 && <p className="text-gray-500 text-sm">No addresses saved.</p>}
                  {customer.addresses?.map(address => (
                    <div key={address.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{address.first_name} {address.last_name}</span>
                        {address.is_default && <AdminBadge variant="blue">Default</AdminBadge>}
                      </div>
                      <p className="text-sm text-gray-600">{address.address_line1}</p>
                      {address.address_line2 && <p className="text-sm text-gray-600">{address.address_line2}</p>}
                      <p className="text-sm text-gray-600">{address.city}, {address.state} {address.postal_code}</p>
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5"><MapPin size={12}/> {address.phone}</p>
                    </div>
                  ))}
                </div>
             </AdminCard>
          )}

          {activeTab === 'marketing' && (
             <AdminCard title="Consent & Loyalty Settings">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Email Marketing</span>
                    <AdminBadge variant={customer.email_consent ? 'green' : 'gray'}>{customer.email_consent ? 'Subscribed' : 'Opted Out'}</AdminBadge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">SMS Marketing</span>
                    <AdminBadge variant={customer.sms_consent ? 'green' : 'gray'}>{customer.sms_consent ? 'Subscribed' : 'Opted Out'}</AdminBadge>
                  </div>
                  <div className="p-4 mt-6 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
                    <strong>Architecture Ready:</strong> Loyalty Points, Reward Tiers, and Segment integrations are mapped in the database schema and ready for future UI implementation.
                  </div>
                </div>
             </AdminCard>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminCard title="Internal Admin Notes">
            <form onSubmit={handleAddNote} className="mb-6 space-y-3">
              <textarea 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a private note..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                rows="3"
                required
              />
              <div className="flex justify-end">
                <AdminButton type="submit" disabled={isSubmittingNote || !newNote.trim()}>
                  {isSubmittingNote ? 'Saving...' : 'Add Note'}
                </AdminButton>
              </div>
            </form>

            <div className="space-y-4">
              {customer.notes?.map(note => (
                <div key={note.id} className={`p-3 rounded-lg border text-sm ${note.is_pinned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-700">{note.admin_first_name} {note.admin_last_name}</span>
                    <span className="text-[10px] text-gray-500">{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
              {customer.notes?.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">No internal notes.</p>
              )}
            </div>
          </AdminCard>
        </div>

      </div>

    </div>
  );
}
